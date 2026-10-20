import { Client, Account, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

/**
 * Sign in with email and password.
 */
async function signInWithEmail(email, password) {
  return account.createEmailPasswordSession(email, password);
}

/**
 * Sign up with name, email, password — then immediately create a session.
 */
async function signUpWithEmail(name, email, password) {
  await account.create(ID.unique(), email, password, name);
  return account.createEmailPasswordSession(email, password);
}

/**
 * Build the Appwrite OAuth endpoint URL.
 */
function getOAuth2Url(provider, successUrl, failureUrl) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sfo.cloud.appwrite.io/v1";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6ad0f8ab0025a03812f7";
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
function signInWithOAuthPopup(provider) {
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
    let pollInterval = null;

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener("message", handleMessage);
    };

    const handleMessage = async (event) => {
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
          resolve(data.user || { name: "User" });
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
async function signInWithGithub() {
  return signInWithOAuthPopup("github");
}

/**
 * OAuth sign-in with Google using popup window.
 */
async function signInWithGoogle() {
  return signInWithOAuthPopup("google");
}

export {
  client,
  account,
  databases,
  signInWithEmail,
  signUpWithEmail,
  signInWithGithub,
  signInWithGoogle,
  signInWithOAuthPopup,
};

