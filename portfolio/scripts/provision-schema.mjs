import { execSync } from "node:child_process";

const DATABASE_ID = "6ad10e56000c6dabf276";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function runCmd(cmd) {
  console.log(`\n> ${cmd}`);
  try {
    const out = execSync(cmd, { encoding: "utf8", stdio: "pipe" });
    console.log(out.trim());
    return true;
  } catch (err) {
    const out = (err.stdout || "") + (err.stderr || "") + (err.message || "");
    if (out.includes("already exists") || out.includes("already_exists")) {
      console.log("  ✓ Already exists");
      return true;
    }
    console.warn("  ⚠️ Warning:", out.trim());
    return false;
  }
}

async function main() {
  console.log("==========================================");
  console.log("🚀 Provisioning Appwrite Schema & Indexes");
  console.log("Database ID:", DATABASE_ID);
  console.log("==========================================");

  // 1. Posts attributes
  console.log("\n📦 Provisioning 'posts' attributes...");
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key slug --size 255 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key title --size 255 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key category --size 100 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key excerpt --size 1000 --xdefault ""`);
  await sleep(1500);
  runCmd(`appwrite databases create-mediumtext-attribute --database-id ${DATABASE_ID} --collection-id posts --key content --xdefault ""`);
  await sleep(1500);
  runCmd(`appwrite databases create-integer-attribute --database-id ${DATABASE_ID} --collection-id posts --key readTimeMinutes --xdefault 5`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key publishedAt --size 50 --xdefault ""`);
  await sleep(1500);
  runCmd(`appwrite databases create-boolean-attribute --database-id ${DATABASE_ID} --collection-id posts --key featured --xdefault false`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key status --size 20 --xdefault "published"`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key coverImage --size 500 --xdefault ""`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key tags --size 50 --array`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key authorName --size 100 --xdefault "Vikas N Dhavande"`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key authorRole --size 150 --xdefault "Lead Avionics & Product Engineer"`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key authorAvatar --size 500 --xdefault "/avatar.png"`);
  await sleep(2000);

  // 2. Comments attributes
  console.log("\n📦 Provisioning 'comments' attributes...");
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id comments --key postSlug --size 255 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id comments --key authorId --size 100 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id comments --key authorName --size 100 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id comments --key authorAvatar --size 500 --xdefault "/avatar.png"`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id comments --key content --size 5000 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id comments --key createdAt --size 50 --required`);
  await sleep(2000);

  // 3. Reactions attributes
  console.log("\n📦 Provisioning 'reactions' attributes...");
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id reactions --key postSlug --size 255 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id reactions --key userId --size 100 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id reactions --key reactionType --size 30 --required`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id reactions --key createdAt --size 50 --required`);
  await sleep(3000);

  // 4. Indexes
  console.log("\n⚡ Creating Indexes...");
  runCmd(`appwrite databases create-index --database-id ${DATABASE_ID} --collection-id posts --key idx_slug --type unique --attributes slug`);
  await sleep(1500);
  runCmd(`appwrite databases create-index --database-id ${DATABASE_ID} --collection-id posts --key idx_category --type key --attributes category`);
  await sleep(1500);
  runCmd(`appwrite databases create-index --database-id ${DATABASE_ID} --collection-id comments --key idx_post_slug --type key --attributes postSlug`);
  await sleep(1500);
  runCmd(`appwrite databases create-index --database-id ${DATABASE_ID} --collection-id reactions --key idx_reaction_unique --type unique --attributes postSlug --attributes userId --attributes reactionType`);
  
  console.log("\n✅ Appwrite Database schema and indexes provisioned successfully!");
}

main().catch(console.error);

