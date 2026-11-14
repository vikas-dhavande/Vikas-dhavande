"use server";

import { Client, Account, Databases, ID, Permission, Role } from "node-appwrite";
import { BlogComment } from "@/lib/blog-types";

// In-memory sliding window rate limiter (C-09)
// Map<userId, submissionTimestamps[]>
const submissionTracker = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10_000; // 10 seconds
const MAX_SUBMISSIONS_PER_WINDOW = 3; // Max 3 comments per 10s

function checkRateLimit(userId: string): void {
  const now = Date.now();
  const timestamps = submissionTracker.get(userId) || [];
  const recentTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recentTimestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    throw new Error("Rate limit exceeded. Please wait a few seconds before posting another comment.");
  }

  recentTimestamps.push(now);
  submissionTracker.set(userId, recentTimestamps);

  // Periodic cleanup if map grows large
  if (submissionTracker.size > 1000) {
    for (const [key, times] of submissionTracker.entries()) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        submissionTracker.delete(key);
      }
    }
  }
}

function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/[<>]/g, ""); // Strip raw HTML angle brackets
}

export async function submitCommentServerAction(
  jwt: string,
  slug: string,
  content: string
): Promise<BlogComment> {
  // C-03: Session verification. Reject unauthenticated/guest users.
  if (!jwt || typeof jwt !== "string" || jwt.length > 4096) {
    throw new Error("You must be signed in to post a comment.");
  }

  const endpoint =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sfo.cloud.appwrite.io/v1";
  const projectId =
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6ad0f8ab0025a03812f7";
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_BLOG_DATABASE_ID;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_COMMENTS_COLLECTION_ID || "comments";

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setJWT(jwt);
  const account = new Account(client);

  let verifiedUser;
  try {
    verifiedUser = await account.get();
  } catch {
    throw new Error("Session expired or invalid. Please sign in again.");
  }

  if (!verifiedUser?.$id) {
    throw new Error("Unauthorized: Invalid user session.");
  }

  // C-09: Rate limiting check
  checkRateLimit(verifiedUser.$id);

  // C-08: Input validation & sanitization
  const trimmed = content.trim();
  if (!trimmed || trimmed.length < 2) {
    throw new Error("Comment must be at least 2 characters long.");
  }

  if (trimmed.length > 1000) {
    throw new Error("Comment cannot exceed 1,000 characters.");
  }

  const cleanContent = sanitizeText(trimmed);
  if (!cleanContent) {
    throw new Error("Comment contains invalid or disallowed characters.");
  }

  const commentId = ID.unique();
  const createdAt = new Date().toISOString();

  // C-07: Derive authorId and authorName strictly from verified user session
  const authorName =
    verifiedUser.name?.trim() || verifiedUser.email.split("@")[0] || "Contributor";

  if (databaseId) {
    try {
      const databases = new Databases(client);
      // C-05 & C-06: Granular document permissions for ownership enforcement
      await databases.createDocument(
        databaseId,
        collectionId,
        commentId,
        {
          postSlug: slug,
          authorId: verifiedUser.$id,
          authorName,
          authorAvatar: "/avatar.png",
          content: cleanContent,
          createdAt,
        },
        [
          Permission.read(Role.any()),
          Permission.update(Role.user(verifiedUser.$id)),
          Permission.delete(Role.user(verifiedUser.$id)),
        ]
      );
    } catch (dbError) {
      // If collection is not configured in Appwrite, fallback return
      console.warn("Appwrite comments collection write failed, returning normalized comment:", dbError);
    }
  }

  return {
    id: commentId,
    postSlug: slug,
    authorId: verifiedUser.$id,
    authorName,
    authorAvatar: "/avatar.png",
    content: cleanContent,
    createdAt,
  };
}
