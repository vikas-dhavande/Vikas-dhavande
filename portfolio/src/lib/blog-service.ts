import { databases, account } from "@/lib/appwrite";
import { submitCommentServerAction } from "@/app/blog/comment-actions";
import { BlogPost, BlogFilterOptions, BlogReaction, BlogComment } from "@/lib/blog-types";
import defaultBlogPosts from "@/data/blog-data.json";
import { Query, ID } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_BLOG_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID;
const COMMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID || "comments";
const REACTIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REACTIONS_COLLECTION_ID || "reactions";

/**
 * Normalizes an Appwrite document or JSON object into a typed BlogPost.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown, fallback: string): string {
  return typeof value === "string" && value ? value : fallback;
}

function normalizePost(doc: Record<string, unknown>): BlogPost {
  let authorValue = doc.author;
  if (typeof authorValue === "string") {
    try {
      authorValue = JSON.parse(authorValue);
    } catch {
      authorValue = { name: authorValue, role: "Engineering Contributor" };
    }
  }

  let tagsValue = doc.tags;
  if (typeof tagsValue === "string") {
    const rawTags = tagsValue;
    try {
      tagsValue = JSON.parse(rawTags);
    } catch {
      tagsValue = rawTags.split(",").map((tag) => tag.trim());
    }
  }

  const author = isRecord(authorValue) ? authorValue : {};
  const tags = Array.isArray(tagsValue)
    ? tagsValue.filter((tag): tag is string => typeof tag === "string")
    : ["Avionics", "Engineering"];

  const slug = getString(doc.slug, "untitled-article");
  const category = getString(doc.category, "Engineering");
  const readTimeMinutes = Number(doc.readTimeMinutes) || 5;
  const content = getString(doc.content, "");
  const excerpt = getString(doc.excerpt, "");
  const publishedAt = getString(doc.publishedAt, getString(doc.$createdAt, new Date().toISOString()));

  return {
    $id: getString(doc.$id, "") || getString(doc.id, "") || ID.unique(),
    title: getString(doc.title, "Untitled Article"),
    slug,
    segments: [category.toLowerCase(), slug],
    href: `/blog/${slug}`,
    description: excerpt || getString(doc.title, "Untitled Article"),
    excerpt,
    content,
    markdown: content,
    category,
    date: publishedAt,
    publishedAt,
    readingTime: `${readTimeMinutes} min`,
    readTimeMinutes,
    featured: Boolean(doc.featured),
    status: (doc.status as "published" | "draft") || "published",
    coverImage: typeof doc.coverImage === "string" ? doc.coverImage : undefined,
    tags,
    headings: [],
    author: {
      name: getString(author.name, "Vikas N Dhavande"),
      role: getString(author.role, "Lead Avionics & Product Engineer"),
      avatar: getString(author.avatar, "/avatar.png"),
    },
  };
}

/**
 * Filter posts in memory (used for fallback dataset or local refinements).
 */
function filterLocalPosts(posts: BlogPost[], options?: BlogFilterOptions): BlogPost[] {
  let result = [...posts];

  if (options?.category && options.category !== "All") {
    result = result.filter(
      (p) => p.category.toLowerCase() === options.category?.toLowerCase()
    );
  }

  if (options?.tag) {
    result = result.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === options.tag?.toLowerCase())
    );
  }

  if (options?.search && options.search.trim() !== "") {
    const q = options.search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort descending by publication date
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return result;
}

/**
 * Fetches all blog posts from Appwrite Cloud, with graceful fallback to local data.
 */
export async function getBlogPosts(options?: BlogFilterOptions): Promise<BlogPost[]> {
  if (DATABASE_ID && COLLECTION_ID && databases) {
    try {
      const queries = [Query.orderDesc("publishedAt"), Query.limit(50)];

      if (options?.category && options.category !== "All") {
        queries.push(Query.equal("category", options.category));
      }

      if (options?.search && options.search.trim() !== "") {
        queries.push(Query.search("title", options.search.trim()));
      }

      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, queries);
      if (response && response.documents && response.documents.length > 0) {
        const posts = response.documents.map(normalizePost);
        return filterLocalPosts(posts, options);
      }
    } catch (err) {
      // Graceful fallback on network/credential disconnects
      console.warn("[Appwrite BlogService] Fallback to local blog seed data:", err);
    }
  }

  // Resilient fallback to local seed data
  const localList = defaultBlogPosts.map(normalizePost);
  return filterLocalPosts(localList, options);
}

/**
 * Fetches a single blog post by its URL slug.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (DATABASE_ID && COLLECTION_ID && databases) {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal("slug", slug),
        Query.limit(1),
      ]);

      if (response && response.documents && response.documents.length > 0) {
        return normalizePost(response.documents[0]);
      }
    } catch {
      // Fall through to local fallback
    }
  }

  const localList = defaultBlogPosts.map(normalizePost);
  const found = localList.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return found || null;
}

/**
 * Fetches related articles excluding the current post slug.
 */
export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts();
  return allPosts
    .filter((p) => p.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === category && b.category !== category) return -1;
      if (a.category !== category && b.category === category) return 1;
      return 0;
    })
    .slice(0, limit);
}

/**
 * Fetches all post slugs for static path pregeneration.
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((p) => p.slug);
}

/**
 * Creates a new blog post in Appwrite Cloud (requires write permissions).
 */
export async function createBlogPost(postData: Partial<BlogPost>): Promise<BlogPost> {
  if (!DATABASE_ID || !COLLECTION_ID) {
    throw new Error("Appwrite Blog Database ID and Collection ID are not configured in environment variables.");
  }

  const slug =
    postData.slug ||
    postData.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") ||
    ID.unique();

  const payload: Record<string, unknown> = {
    title: postData.title,
    slug,
    excerpt: postData.excerpt || "",
    content: postData.content || "",
    category: postData.category || "Engineering",
    publishedAt: postData.publishedAt || new Date().toISOString(),
    readTimeMinutes: postData.readTimeMinutes || 5,
    featured: Boolean(postData.featured),
    status: postData.status || "published",
    coverImage: postData.coverImage || "",
    tags: Array.isArray(postData.tags) ? postData.tags : [],
    author: JSON.stringify(postData.author || {
      name: "Vikas N Dhavande",
      role: "Lead Avionics & Product Engineer",
      avatar: "/avatar.png",
    }),
  };

  const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), payload);
  return normalizePost(doc);
}

/**
 * Updates an existing blog post in Appwrite.
 */
export async function updateBlogPost(id: string, postData: Partial<BlogPost>): Promise<BlogPost> {
  if (!DATABASE_ID || !COLLECTION_ID) {
    throw new Error("Appwrite Blog Database ID and Collection ID are not configured in environment variables.");
  }

  const payload: Record<string, unknown> = {};
  if (postData.title !== undefined) payload.title = postData.title;
  if (postData.slug !== undefined) payload.slug = postData.slug;
  if (postData.excerpt !== undefined) payload.excerpt = postData.excerpt;
  if (postData.content !== undefined) payload.content = postData.content;
  if (postData.category !== undefined) payload.category = postData.category;
  if (postData.publishedAt !== undefined) payload.publishedAt = postData.publishedAt;
  if (postData.readTimeMinutes !== undefined) payload.readTimeMinutes = postData.readTimeMinutes;
  if (postData.featured !== undefined) payload.featured = Boolean(postData.featured);
  if (postData.status !== undefined) payload.status = postData.status;
  if (postData.coverImage !== undefined) payload.coverImage = postData.coverImage;
  if (postData.tags !== undefined) payload.tags = postData.tags;
  if (postData.author !== undefined) payload.author = JSON.stringify(postData.author);

  const doc = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, payload);
  return normalizePost(doc);
}

/**
 * Deletes a blog post from Appwrite.
 */
export async function deleteBlogPost(id: string): Promise<boolean> {
  if (!DATABASE_ID || !COLLECTION_ID) {
    throw new Error("Appwrite Blog Database ID and Collection ID are not configured in environment variables.");
  }
  await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Blog Reactions & Comments
// Resilient storage: Client-side storage with Appwrite ready architecture
// ─────────────────────────────────────────────────────────────────────────────

const REACTIONS_KEY_PREFIX = "aerosys_blog_reactions_";
const COMMENTS_KEY_PREFIX = "aerosys_blog_comments_";

export async function getBlogReactions(slug: string, userId?: string): Promise<BlogReaction> {
  if (DATABASE_ID) {
    try {
      const res = await databases.listDocuments(DATABASE_ID, REACTIONS_COLLECTION_ID, [
        Query.equal("postSlug", slug),
        Query.limit(500),
      ]);

      let likes = 0;
      let rockets = 0;
      let hearts = 0;
      let ideas = 0;
      const userReactions: string[] = [];

      for (const doc of res.documents) {
        const type = String(doc.reactionType || "");
        if (type === "like") likes++;
        else if (type === "rocket") rockets++;
        else if (type === "heart") hearts++;
        else if (type === "idea") ideas++;

        if (userId && doc.userId === userId && !userReactions.includes(type)) {
          userReactions.push(type);
        }
      }

      return { likes, rockets, hearts, ideas, userReactions };
    } catch {
      // Fallback to local storage if Appwrite collection is not yet created
    }
  }

  if (typeof window === "undefined") {
    return { likes: 12, rockets: 5, hearts: 8, ideas: 4, userReactions: [] };
  }

  try {
    const raw = localStorage.getItem(`${REACTIONS_KEY_PREFIX}${slug}`);
    if (raw) {
      const data = JSON.parse(raw);
      const userReactions = userId && data.users && data.users[userId] ? data.users[userId] : [];
      return {
        likes: data.likes ?? 12,
        rockets: data.rockets ?? 5,
        hearts: data.hearts ?? 8,
        ideas: data.ideas ?? 4,
        userReactions,
      };
    }
  } catch {
    // fallback
  }

  return { likes: 12, rockets: 5, hearts: 8, ideas: 4, userReactions: [] };
}

export async function toggleBlogReaction(
  slug: string,
  reactionType: "like" | "rocket" | "heart" | "idea",
  userId: string
): Promise<BlogReaction> {
  if (DATABASE_ID) {
    try {
      const existing = await databases.listDocuments(DATABASE_ID, REACTIONS_COLLECTION_ID, [
        Query.equal("postSlug", slug),
        Query.equal("userId", userId),
        Query.equal("reactionType", reactionType),
      ]);

      if (existing.documents.length > 0) {
        // Toggle off: remove reaction
        for (const doc of existing.documents) {
          await databases.deleteDocument(DATABASE_ID, REACTIONS_COLLECTION_ID, doc.$id);
        }
      } else {
        // Toggle on: add reaction with userId tracking
        await databases.createDocument(DATABASE_ID, REACTIONS_COLLECTION_ID, ID.unique(), {
          postSlug: slug,
          userId,
          reactionType,
          createdAt: new Date().toISOString(),
        });
      }

      return await getBlogReactions(slug, userId);
    } catch {
      // Fallback to local storage
    }
  }

  if (typeof window === "undefined") {
    return { likes: 12, rockets: 5, hearts: 8, ideas: 4, userReactions: [reactionType] };
  }

  const raw = localStorage.getItem(`${REACTIONS_KEY_PREFIX}${slug}`);
  const store = raw ? JSON.parse(raw) : { likes: 12, rockets: 5, hearts: 8, ideas: 4, users: {} };
  if (!store.users) store.users = {};
  if (!store.users[userId]) store.users[userId] = [];

  const keyMap: Record<string, "likes" | "rockets" | "hearts" | "ideas"> = {
    like: "likes",
    rocket: "rockets",
    heart: "hearts",
    idea: "ideas",
  };
  const countKey = keyMap[reactionType];

  const hasReacted = store.users[userId].includes(reactionType);
  if (hasReacted) {
    store.users[userId] = store.users[userId].filter((t: string) => t !== reactionType);
    store[countKey] = Math.max(0, (store[countKey] || 1) - 1);
  } else {
    store.users[userId].push(reactionType);
    store[countKey] = (store[countKey] || 0) + 1;
  }

  localStorage.setItem(`${REACTIONS_KEY_PREFIX}${slug}`, JSON.stringify(store));

  return {
    likes: store.likes,
    rockets: store.rockets,
    hearts: store.hearts,
    ideas: store.ideas,
    userReactions: store.users[userId],
  };
}

export async function getBlogComments(slug: string): Promise<BlogComment[]> {
  if (DATABASE_ID) {
    try {
      const res = await databases.listDocuments(DATABASE_ID, COMMENTS_COLLECTION_ID, [
        Query.equal("postSlug", slug),
        Query.orderDesc("createdAt"),
        Query.limit(100),
      ]);

      if (res.documents.length > 0) {
        return res.documents.map((doc) => ({
          id: doc.$id,
          postSlug: getString(doc.postSlug, slug),
          authorId: getString(doc.authorId, "anonymous"),
          authorName: getString(doc.authorName, "Engineering Contributor"),
          authorAvatar: getString(doc.authorAvatar, "/avatar.png"),
          content: getString(doc.content, ""),
          createdAt: getString(doc.createdAt, doc.$createdAt),
        }));
      }
    } catch {
      // Fallback to local storage
    }
  }

  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(`${COMMENTS_KEY_PREFIX}${slug}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }

  // Sample initial comment for lively UX
  const seedComments: BlogComment[] = [
    {
      id: "seed-1",
      postSlug: slug,
      authorId: "member-sample",
      authorName: "Sarah Chen",
      authorAvatar: "/avatar.png",
      content: "Excellent breakdown of the RTOS scheduling latency requirements! The deterministic timing benchmarks are especially relevant.",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ];
  return seedComments;
}

export async function addBlogComment(
  slug: string,
  commentData: {
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
  }
): Promise<BlogComment> {
  // 1. Try server action with authenticated JWT verification (C-03, C-07, C-08, C-09)
  try {
    const jwt = await account.createJWT();
    if (jwt?.jwt) {
      const serverComment = await submitCommentServerAction(jwt.jwt, slug, commentData.content);
      if (typeof window !== "undefined") {
        const existing = await getBlogComments(slug);
        const updated = [serverComment, ...existing];
        localStorage.setItem(`${COMMENTS_KEY_PREFIX}${slug}`, JSON.stringify(updated));
      }
      return serverComment;
    }
  } catch (err) {
    // If error indicates unauthorized or rate limited, propagate immediately
    if (
      err instanceof Error &&
      (err.message.includes("signed in") ||
        err.message.includes("Rate limit") ||
        err.message.includes("characters") ||
        err.message.includes("Session expired"))
    ) {
      throw err;
    }
  }

  // 2. Fallback to client SDK only if database is configured and server action was bypassed
  const newComment: BlogComment = {
    id: ID.unique(),
    postSlug: slug,
    authorId: commentData.authorId,
    authorName: commentData.authorName,
    authorAvatar: commentData.authorAvatar || "/avatar.png",
    content: commentData.content.trim(),
    createdAt: new Date().toISOString(),
  };

  if (DATABASE_ID) {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        COMMENTS_COLLECTION_ID,
        newComment.id,
        {
          postSlug: newComment.postSlug,
          authorId: newComment.authorId,
          authorName: newComment.authorName,
          authorAvatar: newComment.authorAvatar,
          content: newComment.content,
          createdAt: newComment.createdAt,
        }
      );

      return {
        id: doc.$id,
        postSlug: getString(doc.postSlug, slug),
        authorId: getString(doc.authorId, commentData.authorId),
        authorName: getString(doc.authorName, commentData.authorName),
        authorAvatar: getString(doc.authorAvatar, "/avatar.png"),
        content: getString(doc.content, commentData.content),
        createdAt: getString(doc.createdAt, newComment.createdAt),
      };
    } catch {
      // Fallback to local storage
    }
  }

  if (typeof window !== "undefined") {
    const existing = await getBlogComments(slug);
    const updated = [newComment, ...existing];
    localStorage.setItem(`${COMMENTS_KEY_PREFIX}${slug}`, JSON.stringify(updated));
  }

  return newComment;
}
