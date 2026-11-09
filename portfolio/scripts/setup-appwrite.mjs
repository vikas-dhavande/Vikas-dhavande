import { Client, Databases, Storage, Permission, Role, ID } from "node-appwrite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://sfo.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || "6ad0f8ab0025a03812f7";
const API_KEY = process.env.APPWRITE_API_KEY || process.argv[2];
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "6ad10e56000c6dabf276";
const ADMIN_TEAM_ID = "6ad10274001680d2dbe9";

if (!API_KEY) {
  console.error("❌ Error: Missing Appwrite API key.");
  console.error("Usage: node setup-appwrite.mjs <APPWRITE_API_KEY>");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

// Helper for delays between attribute creations
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureCollection(collectionId, name, permissions) {
  try {
    const col = await databases.getCollection(DATABASE_ID, collectionId);
    console.log(`✓ Collection "${name}" (${collectionId}) already exists.`);
    return col;
  } catch (err) {
    if (err.code === 404) {
      console.log(`Creating collection "${name}" (${collectionId})...`);
      const col = await databases.createCollection(
        DATABASE_ID,
        collectionId,
        name,
        permissions,
        false // documentSecurity disabled (collection-level rules apply)
      );
      console.log(`✓ Collection "${name}" created.`);
      return col;
    }
    throw err;
  }
}

async function ensureStringAttribute(collectionId, key, size, required, defaultValue = undefined, array = false) {
  try {
    await databases.getAttribute(DATABASE_ID, collectionId, key);
    console.log(`  ✓ Attribute "${key}" exists.`);
  } catch (err) {
    if (err.code === 404) {
      console.log(`  + Creating attribute "${key}"...`);
      await databases.createStringAttribute(
        DATABASE_ID,
        collectionId,
        key,
        size,
        required,
        defaultValue,
        array
      );
      await wait(1000);
    } else {
      throw err;
    }
  }
}

async function ensureIntegerAttribute(collectionId, key, required, min = undefined, max = undefined, defaultValue = undefined) {
  try {
    await databases.getAttribute(DATABASE_ID, collectionId, key);
    console.log(`  ✓ Attribute "${key}" exists.`);
  } catch (err) {
    if (err.code === 404) {
      console.log(`  + Creating integer attribute "${key}"...`);
      await databases.createIntegerAttribute(
        DATABASE_ID,
        collectionId,
        key,
        required,
        min,
        max,
        defaultValue
      );
      await wait(1000);
    } else {
      throw err;
    }
  }
}

async function ensureBooleanAttribute(collectionId, key, required, defaultValue = false) {
  try {
    await databases.getAttribute(DATABASE_ID, collectionId, key);
    console.log(`  ✓ Attribute "${key}" exists.`);
  } catch (err) {
    if (err.code === 404) {
      console.log(`  + Creating boolean attribute "${key}"...`);
      await databases.createBooleanAttribute(
        DATABASE_ID,
        collectionId,
        key,
        required,
        defaultValue
      );
      await wait(1000);
    } else {
      throw err;
    }
  }
}

async function ensureIndex(collectionId, key, type, attributes, orders = undefined) {
  try {
    await databases.getIndex(DATABASE_ID, collectionId, key);
    console.log(`  ✓ Index "${key}" exists.`);
  } catch (err) {
    if (err.code === 404) {
      console.log(`  + Creating index "${key}"...`);
      await databases.createIndex(DATABASE_ID, collectionId, key, type, attributes, orders);
      await wait(1000);
    } else {
      throw err;
    }
  }
}

async function setupPostsCollection() {
  console.log("\n📦 Setting up 'posts' collection...");
  const permissions = [
    Permission.read(Role.any()),
    Permission.create(Role.team(ADMIN_TEAM_ID)),
    Permission.update(Role.team(ADMIN_TEAM_ID)),
    Permission.delete(Role.team(ADMIN_TEAM_ID)),
    Permission.create(Role.users()),
  ];

  await ensureCollection("posts", "Blog Posts", permissions);

  await ensureStringAttribute("posts", "title", 255, true);
  await ensureStringAttribute("posts", "slug", 150, true);
  await ensureStringAttribute("posts", "excerpt", 1000, false);
  await ensureStringAttribute("posts", "content", 100000, true);
  await ensureStringAttribute("posts", "category", 50, true, "Engineering");
  await ensureStringAttribute("posts", "publishedAt", 50, false);
  await ensureIntegerAttribute("posts", "readTimeMinutes", false, 1, 120, 5);
  await ensureBooleanAttribute("posts", "featured", false, false);
  await ensureStringAttribute("posts", "status", 20, false, "published");
  await ensureStringAttribute("posts", "coverImage", 2048, false);
  await ensureStringAttribute("posts", "tags", 50, false, undefined, true);
  await ensureStringAttribute("posts", "author", 2048, false);

  // Wait for attributes to become available before indexing
  console.log("  ⏳ Waiting for attributes to index...");
  await wait(3000);

  await ensureIndex("posts", "idx_slug_unique", "unique", ["slug"]);
  await ensureIndex("posts", "idx_category", "key", ["category"]);
  await ensureIndex("posts", "idx_featured", "key", ["featured"]);
  await ensureIndex("posts", "idx_publishedAt", "key", ["publishedAt"], ["DESC"]);
}

async function setupCommentsCollection() {
  console.log("\n💬 Setting up 'comments' collection...");
  const permissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()), // allows guests/users to comment
    Permission.update(Role.team(ADMIN_TEAM_ID)),
    Permission.delete(Role.team(ADMIN_TEAM_ID)),
  ];

  await ensureCollection("comments", "Blog Comments", permissions);

  await ensureStringAttribute("comments", "postSlug", 150, true);
  await ensureStringAttribute("comments", "authorId", 100, true);
  await ensureStringAttribute("comments", "authorName", 100, true);
  await ensureStringAttribute("comments", "authorAvatar", 2048, false);
  await ensureStringAttribute("comments", "content", 2000, true);
  await ensureStringAttribute("comments", "createdAt", 50, true);

  await wait(3000);
  await ensureIndex("comments", "idx_comment_slug", "key", ["postSlug"]);
  await ensureIndex("comments", "idx_comment_author", "key", ["authorId"]);
}

async function setupReactionsCollection() {
  console.log("\n❤️ Setting up 'reactions' collection...");
  const permissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any()),
  ];

  await ensureCollection("reactions", "Blog Reactions", permissions);

  await ensureStringAttribute("reactions", "postSlug", 150, true);
  await ensureStringAttribute("reactions", "userId", 100, true);
  await ensureStringAttribute("reactions", "reactionType", 20, true);
  await ensureStringAttribute("reactions", "createdAt", 50, true);

  await wait(3000);
  await ensureIndex("reactions", "idx_reaction_slug", "key", ["postSlug"]);
  await ensureIndex("reactions", "idx_reaction_user", "key", ["userId"]);
  await ensureIndex(
    "reactions",
    "idx_user_reaction_unique",
    "unique",
    ["postSlug", "userId", "reactionType"]
  );
}

async function setupStorageBucket() {
  console.log("\n🖼️ Setting up 'blog-images' storage bucket...");
  const bucketId = "blog-images";
  try {
    await storage.getBucket(bucketId);
    console.log(`✓ Bucket "${bucketId}" already exists.`);
  } catch (err) {
    if (err.code === 404) {
      console.log(`Creating bucket "${bucketId}"...`);
      await storage.createBucket(
        bucketId,
        "Blog Images",
        [
          Permission.read(Role.any()),
          Permission.create(Role.team(ADMIN_TEAM_ID)),
          Permission.update(Role.team(ADMIN_TEAM_ID)),
          Permission.delete(Role.team(ADMIN_TEAM_ID)),
          Permission.create(Role.users()),
        ],
        false, // fileSecurity
        true,  // enabled
        10485760, // 10 MB max file size
        ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"]
      );
      console.log(`✓ Bucket "${bucketId}" created successfully.`);
    } else {
      throw err;
    }
  }
}

async function seedBlogPosts() {
  console.log("\n🌱 Seeding initial blog articles from blog-data.json...");
  const dataPath = path.resolve(__dirname, "../src/data/blog-data.json");
  if (!fs.existsSync(dataPath)) {
    console.warn("⚠️ blog-data.json not found, skipping seeding.");
    return;
  }

  const posts = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  for (const post of posts) {
    try {
      // Check if document with ID already exists
      const docId = post.$id || ID.unique();
      try {
        await databases.getDocument(DATABASE_ID, "posts", docId);
        console.log(`  ✓ Post "${post.title}" already exists.`);
        continue;
      } catch (e) {
        // Not found, proceed to create
      }

      console.log(`  + Seeding: "${post.title}"...`);
      await databases.createDocument(
        DATABASE_ID,
        "posts",
        docId,
        {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content || "",
          category: post.category || "Engineering",
          publishedAt: post.publishedAt || new Date().toISOString(),
          readTimeMinutes: Number(post.readTimeMinutes) || 5,
          featured: Boolean(post.featured),
          status: "published",
          coverImage: post.coverImage || "",
          tags: Array.isArray(post.tags) ? post.tags : [],
          author: JSON.stringify(post.author || {
            name: "Vikas N Dhavande",
            role: "Lead Avionics & Product Engineer",
            avatar: "/avatar.png"
          })
        }
      );
      console.log(`  ✓ Seeded: "${post.title}"`);
    } catch (err) {
      console.error(`  ❌ Error seeding post "${post.title}":`, err.message);
    }
  }
}

async function main() {
  console.log("==========================================");
  console.log("🚀 Starting Appwrite Blog Database Setup");
  console.log(`Endpoint:    ${ENDPOINT}`);
  console.log(`Project ID:  ${PROJECT_ID}`);
  console.log(`Database ID: ${DATABASE_ID}`);
  console.log("==========================================");

  try {
    await setupPostsCollection();
    await setupCommentsCollection();
    await setupReactionsCollection();
    await setupStorageBucket();
    await seedBlogPosts();

    console.log("\n==========================================");
    console.log("🎉 Appwrite Blog Database Setup Complete!");
    console.log("==========================================");
  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    process.exit(1);
  }
}

main();
