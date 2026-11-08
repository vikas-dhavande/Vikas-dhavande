import { Client, Account, Databases, ID, Models, Storage, Teams } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sfo.cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6ad0f8ab0025a03812f7";
const adminTeamId = process.env.NEXT_PUBLIC_APPWRITE_ADMIN_TEAM_ID || "6ad10274001680d2dbe9";
const blogBucketId = process.env.NEXT_PUBLIC_APPWRITE_BLOG_BUCKET_ID || "blog-images";
const adminUserIds = (process.env.NEXT_PUBLIC_ADMIN_USER_IDS || "6ad10260002175ea6ccb")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "vikasndhavande@gmail.com")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const teams = new Teams(client);

export interface UserRoleInfo {
  isAdmin: boolean;
  role: "admin" | "member" | "guest";
  user: Models.User<Models.Preferences> | null;
}

/**
 * Checks if the user is an admin or a member.
 * Checks against the Appwrite Admin Team membership or configured admin user IDs.
 */
async function checkUserRole(currentUser?: Models.User<Models.Preferences> | null): Promise<UserRoleInfo> {
  try {
    const user = currentUser || (await account.get());
    if (!user) {
      return { isAdmin: false, role: "guest", user: null };
    }

    // 1. Check by explicit email match (e.g. vikasndhavande@gmail.com)
    if (user.email && adminEmails.includes(user.email.toLowerCase().trim())) {
      return { isAdmin: true, role: "admin", user };
    }

    // 2. Check by user ID match
    if (adminUserIds.includes(user.$id)) {
      return { isAdmin: true, role: "admin", user };
    }

    // 3. Check by Appwrite user labels (if set in console)
    const labels = (user as unknown as { labels?: string[] })?.labels;
    if (Array.isArray(labels) && (labels.includes("admin") || labels.includes("admins"))) {
      return { isAdmin: true, role: "admin", user };
    }

    // 4. Check by Appwrite Team membership
    try {
      const userTeams = await teams.list();
      const target = adminTeamId.toLowerCase().trim();
      const hasAdminTeam = userTeams.teams.some((t) => {
        const name = (t.name || "").toLowerCase().trim();
        const id = (t.$id || "").toLowerCase().trim();
        return (
          id === target ||
          name === target ||
          name === "admin" ||
          name === "admins" ||
          name.includes("admin") ||
          id.includes("admin")
        );
      });
      if (hasAdminTeam) {
        return { isAdmin: true, role: "admin", user };
      }
    } catch {
      // Teams check failure (e.g. rate limit or team network)
    }

    // Authenticated regular user is a Member
    return { isAdmin: false, role: "member", user };
  } catch {
    return { isAdmin: false, role: "guest", user: null };
  }
}

/**
 * Convenience check for admin status.
 */
async function isAdmin(): Promise<boolean> {
  const roleInfo = await checkUserRole();
  return roleInfo.isAdmin;
}

/**
 * Convert string to clean URL-safe slug.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Upload an image to the Appwrite blog storage bucket.
 */
async function uploadBlogImage(file: File): Promise<string> {
  if (!blogBucketId) {
    throw new Error("NEXT_PUBLIC_APPWRITE_BLOG_BUCKET_ID is not configured.");
  }
  const uploaded = await storage.createFile(blogBucketId, ID.unique(), file);
  return storage.getFileView(blogBucketId, uploaded.$id).toString();
}

/**
 * Get direct view URL for a file in a storage bucket.
 */
function fileUrl(bucketId: string, fileId: string): string {
  return storage.getFileView(bucketId, fileId).toString();
}

const cfg = {
  endpoint,
  projectId,
  adminTeamId,
  blogBucketId,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_BLOG_DATABASE_ID || "6ad10e56000c6dabf276",
  postsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID || "posts",
};

/**
 * Sign in with email and password.
 */
async function signInWithEmail(email: string, password: string): Promise<Models.Session> {
  return account.createEmailPasswordSession(email, password);
}

/**
 * Sign up with name, email, password — then immediately create a session.
 */
async function signUpWithEmail(name: string, email: string, password: string): Promise<Models.Session> {
  await account.create(ID.unique(), email, password, name);
  return account.createEmailPasswordSession(email, password);
}

/**
 * Build the Appwrite OAuth endpoint URL.
 */
function getOAuth2Url(provider: string, successUrl: string, failureUrl: string): string {
  const url = new URL(`${endpoint}/account/sessions/oauth2/${provider}`);
  url.searchParams.set("project", projectId);
  url.searchParams.set("success", successUrl);
  url.searchParams.set("failure", failureUrl);
  return url.toString();
}

/**
 * Authenticate with an OAuth provider using a centered popup window.
 * Returns a Promise that resolves with the authenticated Appwrite user object.
 */
function signInWithOAuthPopup(provider: "github" | "google" | string): Promise<Models.User<Models.Preferences>> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("OAuth popup can only be initiated in browser environment."));
      return;
    }

    const origin = window.location.origin;
    const successUrl = `${origin}/auth/oauth-callback`;
    const failureUrl = `${origin}/auth/oauth-callback?error=true&provider=${encodeURIComponent(provider)}`;
    const oauthUrl = getOAuth2Url(provider, successUrl, failureUrl);

    // Calculate centered dimensions
    const width = 520;
    const height = 680;
    const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
    const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

    const popup = window.open(
      oauthUrl,
      `appwrite_oauth_${provider}`,
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      reject(
        new Error(
          "Popup window blocked by browser. Please allow popups for this site to sign in."
        )
      );
      return;
    }

    try {
      popup.focus();
    } catch {}

    let isCleanedUp = false;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener("message", handleMessage);
    };

    const handleMessage = async (event: MessageEvent) => {
      // Security check: verify message is strictly from current origin
      if (event.origin !== window.location.origin) return;

      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "APPWRITE_OAUTH_SUCCESS") {
        cleanup();
        try {
          // Re-fetch the current active user session
          const user = await account.get();
          resolve(user);
        } catch {
          resolve((data.user || { name: "User" }) as Models.User<Models.Preferences>);
        }
      } else if (data.type === "APPWRITE_OAUTH_FAILURE") {
        cleanup();
        const msg =
          data.message ||
          (provider === "google"
            ? "Google OAuth provider is not enabled in the Appwrite Console (HTTP 412). Please configure Google Client ID & Secret in Appwrite Console."
            : `${provider} authentication failed.`);
        reject(new Error(msg));
      }
    };

    window.addEventListener("message", handleMessage);

    // Monitor for user closing the popup manually before finishing
    pollInterval = setInterval(() => {
      if (popup.closed) {
        cleanup();
        setTimeout(async () => {
          try {
            const user = await account.get();
            resolve(user);
          } catch {
            reject(new Error("Authentication popup was closed before completing."));
          }
        }, 500);
      }
    }, 500);
  });
}

/**
 * OAuth sign-in with GitHub using popup window.
 */
async function signInWithGithub(): Promise<Models.User<Models.Preferences>> {
  return signInWithOAuthPopup("github");
}

/**
 * OAuth sign-in with Google using popup window.
 */
async function signInWithGoogle(): Promise<Models.User<Models.Preferences>> {
  return signInWithOAuthPopup("google");
}

export {
  client,
  account,
  databases,
  storage,
  teams,
  checkUserRole,
  isAdmin,
  slugify,
  uploadBlogImage,
  fileUrl,
  cfg,
  signInWithEmail,
  signUpWithEmail,
  signInWithGithub,
  signInWithGoogle,
  signInWithOAuthPopup,
};
