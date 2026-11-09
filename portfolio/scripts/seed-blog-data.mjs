import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATABASE_ID = "6ad10e56000c6dabf276";
const COLLECTION_ID = "posts";

const jsonPath = path.resolve(__dirname, "../src/data/blog-data.json");
const raw = fs.readFileSync(jsonPath, "utf8");
const posts = JSON.parse(raw);

console.log("==========================================");
console.log(`🚀 Seeding ${posts.length} Engineering Articles into Appwrite`);
console.log(`Database:   ${DATABASE_ID}`);
console.log(`Collection: ${COLLECTION_ID}`);
console.log("==========================================");

for (const post of posts) {
  const docId = post.$id || post.slug.slice(0, 36);
  console.log(`\n📝 Seeding: "${post.title}" (ID: ${docId})`);

  const payload = {
    slug: post.slug,
    title: post.title,
    category: post.category,
    excerpt: post.excerpt || "",
    content: post.content || "",
    readTimeMinutes: post.readTimeMinutes || 5,
    publishedAt: post.publishedAt || new Date().toISOString(),
    featured: Boolean(post.featured),
    status: post.status || "published",
    coverImage: post.coverImage || "",
    tags: Array.isArray(post.tags) ? post.tags : ["Engineering"],
    authorName: post.author?.name || "Vikas N Dhavande",
    authorRole: post.author?.role || "Lead Avionics & Product Engineer",
    authorAvatar: post.author?.avatar || "/avatar.png",
  };

  try {
    // Check if document already exists
    execFileSync(
      "appwrite",
      [
        "databases",
        "get-document",
        "--database-id",
        DATABASE_ID,
        "--collection-id",
        COLLECTION_ID,
        "--document-id",
        docId,
      ],
      { stdio: "ignore" }
    );
    console.log(`  ✓ Document "${docId}" already exists in Appwrite.`);
  } catch {
    // Create the document
    try {
      execFileSync(
        "appwrite",
        [
          "databases",
          "create-document",
          "--database-id",
          DATABASE_ID,
          "--collection-id",
          COLLECTION_ID,
          "--document-id",
          docId,
          "--data",
          JSON.stringify(payload),
        ],
        { stdio: "pipe", encoding: "utf8" }
      );
      console.log(`  ✓ Successfully created document "${docId}"!`);
    } catch (err) {
      console.warn(
        `  ❌ Error creating ${docId}:`,
        (err.stderr || err.stdout || err.message).trim()
      );
    }
  }
}

console.log("\n==========================================");
console.log("🎉 All 4 Engineering Articles Seeded Successfully!");
console.log("==========================================");
