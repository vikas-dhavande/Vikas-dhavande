#!/usr/bin/env node

/**
 * Appwrite S3 CLI Management Tool
 * Compatible with AWS S3 CLI semantics for Appwrite Cloud storage.
 */

import {
  S3Client,
  ListBucketsCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

// Load environment from .env or .env.local if present
function loadEnv() {
  const envFiles = [".env.local", ".env", "../.env.local", "../.env"];
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const [k, ...v] = trimmed.split("=");
        if (k && v.length && !process.env[k.trim()]) {
          process.env[k.trim()] = v.join("=").trim().replace(/^["']|["']$/g, "");
        }
      }
    }
  }
}

loadEnv();

const ENDPOINT = process.env.AWS_ENDPOINT_URL || "https://sfo.cloud.appwrite.io/v1/s3";
const REGION = process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || "sfo";
const ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6ad0f8ab0025a03812f7";
const SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY || process.env.APPWRITE_API_KEY || "";

if (!SECRET_KEY) {
  console.warn("⚠️ Warning: AWS_SECRET_ACCESS_KEY is not set. Set it in .env.local or pass via environment variable.");
}

const s3 = new S3Client({
  endpoint: ENDPOINT,
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
  forcePathStyle: true,
});

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

async function listBuckets() {
  console.log(`📡 Listing buckets from ${ENDPOINT}...`);
  const res = await s3.send(new ListBucketsCommand({}));
  if (!res.Buckets || res.Buckets.length === 0) {
    console.log("No buckets found.");
    return;
  }
  console.log("\nBUCKETS:");
  for (const b of res.Buckets) {
    console.log(`  📁 ${b.Name} (created: ${b.CreationDate ? new Date(b.CreationDate).toISOString() : "unknown"})`);
  }
}

async function listObjects(bucket) {
  const cleanBucket = bucket.replace(/^s3:\/\//, "");
  console.log(`📡 Listing objects in s3://${cleanBucket}...`);
  const res = await s3.send(new ListObjectsV2Command({ Bucket: cleanBucket }));
  if (!res.Contents || res.Contents.length === 0) {
    console.log(`Bucket "${cleanBucket}" is empty.`);
    return;
  }
  console.log(`\nFILES IN s3://${cleanBucket}:`);
  for (const item of res.Contents) {
    const size = formatBytes(item.Size || 0);
    const date = item.LastModified ? new Date(item.LastModified).toISOString() : "";
    console.log(`  📄 ${item.Key} (${size}, ${date})`);
  }
}

async function createBucket(bucket) {
  const cleanBucket = bucket.replace(/^s3:\/\//, "");
  console.log(`🚀 Creating bucket s3://${cleanBucket}...`);
  await s3.send(new CreateBucketCommand({ Bucket: cleanBucket }));
  console.log(`✓ Bucket "${cleanBucket}" created successfully.`);
}

async function uploadFile(srcPath, destUri) {
  if (!fs.existsSync(srcPath)) {
    console.error(`❌ Local file not found: ${srcPath}`);
    process.exit(1);
  }

  // Parse s3://bucket/key or s3://bucket
  const cleanDest = destUri.replace(/^s3:\/\//, "");
  const [bucket, ...keyParts] = cleanDest.split("/");
  let key = keyParts.join("/");
  if (!key) {
    key = path.basename(srcPath);
  }

  console.log(`⬆️ Uploading ${srcPath} -> s3://${bucket}/${key}...`);
  const fileStream = fs.createReadStream(srcPath);
  const stats = fs.statSync(srcPath);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileStream,
      ContentLength: stats.size,
    })
  );

  console.log(`✓ Uploaded ${key} (${formatBytes(stats.size)}) to s3://${bucket}/`);
}

async function downloadFile(srcUri, destPath) {
  const cleanSrc = srcUri.replace(/^s3:\/\//, "");
  const [bucket, ...keyParts] = cleanSrc.split("/");
  const key = keyParts.join("/");

  if (!key) {
    console.error("❌ Destination object key must be specified. Format: s3://bucket/key");
    process.exit(1);
  }

  const resolvedDest = destPath || path.basename(key);
  console.log(`⬇️ Downloading s3://${bucket}/${key} -> ${resolvedDest}...`);

  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const writeStream = fs.createWriteStream(resolvedDest);
  await pipeline(res.Body, writeStream);

  console.log(`✓ Downloaded to ${resolvedDest}`);
}

async function deleteFile(uri) {
  const clean = uri.replace(/^s3:\/\//, "");
  const [bucket, ...keyParts] = clean.split("/");
  const key = keyParts.join("/");

  if (!key) {
    console.error("❌ Key must be specified. Format: s3://bucket/key");
    process.exit(1);
  }

  console.log(`🗑️ Deleting s3://${bucket}/${key}...`);
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  console.log(`✓ Deleted ${key} from s3://${bucket}/`);
}

async function removeBucket(bucket, force = false) {
  const cleanBucket = bucket.replace(/^s3:\/\//, "");
  console.log(`🔥 Removing bucket s3://${cleanBucket} (force=${force})...`);

  if (force) {
    const listRes = await s3.send(new ListObjectsV2Command({ Bucket: cleanBucket }));
    if (listRes.Contents && listRes.Contents.length > 0) {
      console.log(`  Purging ${listRes.Contents.length} objects...`);
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: cleanBucket,
          Delete: {
            Objects: listRes.Contents.map((o) => ({ Key: o.Key })),
          },
        })
      );
    }
  }

  await s3.send(new DeleteBucketCommand({ Bucket: cleanBucket }));
  console.log(`✓ Bucket "${cleanBucket}" removed successfully.`);
}

function printUsage() {
  console.log(`
Appwrite S3 CLI Management Tool
Connected to: ${ENDPOINT}
Project ID:   ${ACCESS_KEY}

Usage:
  node scripts/s3.mjs ls                         # List buckets
  node scripts/s3.mjs ls <bucket>                # List files in bucket
  node scripts/s3.mjs mb <bucket>                # Create bucket
  node scripts/s3.mjs cp <file> <s3://bucket/>   # Upload file
  node scripts/s3.mjs cp <s3://bucket/file> <out># Download file
  node scripts/s3.mjs rm <s3://bucket/file>      # Delete file
  node scripts/s3.mjs rb <bucket> [--force]      # Delete bucket
`);
}

async function main() {
  const [cmd, arg1, arg2, arg3] = process.argv.slice(2);

  if (!cmd || cmd === "--help" || cmd === "-h") {
    printUsage();
    return;
  }

  try {
    switch (cmd) {
      case "ls":
        if (arg1) {
          await listObjects(arg1);
        } else {
          await listBuckets();
        }
        break;

      case "mb":
        if (!arg1) throw new Error("Bucket name required. Example: node s3.mjs mb my-bucket");
        await createBucket(arg1);
        break;

      case "cp":
        if (!arg1 || !arg2) throw new Error("Source and destination required. Example: node s3.mjs cp file.txt s3://my-bucket/file.txt");
        if (arg1.startsWith("s3://")) {
          await downloadFile(arg1, arg2);
        } else {
          await uploadFile(arg1, arg2);
        }
        break;

      case "rm":
        if (!arg1) throw new Error("Target required. Example: node s3.mjs rm s3://my-bucket/file.txt");
        await deleteFile(arg1);
        break;

      case "rb":
        if (!arg1) throw new Error("Bucket name required. Example: node s3.mjs rb my-bucket [--force]");
        const force = arg2 === "--force" || arg3 === "--force";
        await removeBucket(arg1, force);
        break;

      default:
        console.error(`Unknown command: ${cmd}`);
        printUsage();
        process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Command "${cmd}" failed:`, err.message);
    process.exit(1);
  }
}

main();

