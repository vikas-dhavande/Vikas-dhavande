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
  console.log("🚀 Provisioning Remaining Attributes");
  console.log("Database ID:", DATABASE_ID);
  console.log("==========================================");

  // 1. Posts optional attributes
  console.log("\n📦 Provisioning 'posts' remaining attributes...");
  runCmd(`appwrite databases create-mediumtext-attribute --database-id ${DATABASE_ID} --collection-id posts --key content --required=false`);
  await sleep(1500);
  runCmd(`appwrite databases create-integer-attribute --database-id ${DATABASE_ID} --collection-id posts --key readTimeMinutes --required=false --xdefault 5`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key publishedAt --size 50 --required=false`);
  await sleep(1500);
  runCmd(`appwrite databases create-boolean-attribute --database-id ${DATABASE_ID} --collection-id posts --key featured --required=false --xdefault false`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key status --size 20 --required=false --xdefault "published"`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key coverImage --size 500 --required=false`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key tags --size 50 --array --required=false`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key authorName --size 100 --required=false --xdefault "Vikas N Dhavande"`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key authorRole --size 150 --required=false --xdefault "Lead Avionics & Product Engineer"`);
  await sleep(1500);
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id posts --key authorAvatar --size 500 --required=false --xdefault "/avatar.png"`);
  await sleep(2000);

  // 2. Comments optional attributes
  console.log("\n📦 Provisioning 'comments' remaining attributes...");
  runCmd(`appwrite databases create-string-attribute --database-id ${DATABASE_ID} --collection-id comments --key authorAvatar --size 500 --required=false --xdefault "/avatar.png"`);
  await sleep(2000);

  console.log("\n✅ All collection attributes created successfully!");
}

main().catch(console.error);
