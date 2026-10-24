import { databases } from "@/lib/appwrite";
import { BlogPost, BlogFilterOptions } from "@/lib/blog-types";
import defaultBlogPosts from "@/data/blog-data.json";
import { Query, ID } from "appwrite";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_BLOG_DATABASE_ID;
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_BLOG_COLLECTION_ID;

/**
 * Normalizes an Appwrite document or JSON object into a typed BlogPost.
 */
function normalizePost(doc: any): BlogPost {
  let authorObj = doc.author;
  if (typeof authorObj === "string") {
    try {
      authorObj = JSON.parse(authorObj);
    } catch {
      authorObj = { name: authorObj, role: "Engineering Contributor" };
    }
  }

  let tagsArr = doc.tags;
  if (typeof tagsArr === "string") {
    try {
      tagsArr = JSON.parse(tagsArr);
    } catch {
      tagsArr = tagsArr.split(",").map((t: string) => t.trim());
    }
  }

  return {
    $id: doc.$id || doc.id || ID.unique(),
    title: doc.title || "Untitled Article",
    slug: doc.slug || "untitled-article",
    excerpt: doc.excerpt || "",
    content: doc.content || "",
    category: doc.category || "Engineering",
    publishedAt: doc.publishedAt || doc.$createdAt || new Date().toISOString(),
    readTimeMinutes: Number(doc.readTimeMinutes) || 5,
    featured: Boolean(doc.featured),
    coverImage: doc.coverImage || undefined,
    tags: Array.isArray(tagsArr) ? tagsArr : ["Avionics", "Engineering"],
    author: {
      name: authorObj?.name || "Vikas N Dhavande",
      role: authorObj?.role || "Lead Avionics & Product Engineer",
      avatar: authorObj?.avatar || "/avatar.png",
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
  const localList = (defaultBlogPosts as any[]).map(normalizePost);
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

  const localList = (defaultBlogPosts as any[]).map(normalizePost);
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

  const payload = {
    title: postData.title,
    slug,
    excerpt: postData.excerpt || "",
    content: postData.content || "",
    category: postData.category || "Engineering",
    publishedAt: postData.publishedAt || new Date().toISOString(),
    readTimeMinutes: postData.readTimeMinutes || 5,
    featured: Boolean(postData.featured),
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
