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
  type PutObjectCommandInput,
  type _Object,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const DEFAULT_REGION = process.env.AWS_DEFAULT_REGION || process.env.AWS_REGION || "sfo";
const ENDPOINT_URL = process.env.AWS_ENDPOINT_URL || "https://sfo.cloud.appwrite.io/v1/s3";
const ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6ad0f8ab0025a03812f7";
const SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const DEFAULT_BUCKET = process.env.S3_DEFAULT_BUCKET || process.env.NEXT_PUBLIC_APPWRITE_BLOG_BUCKET_ID || "blog-images";

let s3ClientInstance: S3Client | null = null;

/**
 * Returns a singleton configured S3Client for Appwrite S3-compatible storage.
 * Note: forcePathStyle: true is essential for Appwrite S3 endpoint.
 */
export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    if (!SECRET_ACCESS_KEY) {
      console.warn("[S3] Warning: AWS_SECRET_ACCESS_KEY is not defined. S3 operations will fail if unauthenticated.");
    }

    s3ClientInstance = new S3Client({
      region: DEFAULT_REGION,
      endpoint: ENDPOINT_URL,
      credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });
  }
  return s3ClientInstance;
}

/**
 * List all storage buckets (aws s3 ls).
 */
export async function listBuckets(): Promise<{ name: string; creationDate?: Date }[]> {
  const client = getS3Client();
  const res = await client.send(new ListBucketsCommand({}));
  return (res.Buckets || []).map((b) => ({
    name: b.Name || "",
    creationDate: b.CreationDate,
  }));
}

/**
 * Create a new storage bucket (aws s3 mb s3://bucket-name).
 */
export async function createBucket(bucketName: string): Promise<boolean> {
  const client = getS3Client();
  await client.send(new CreateBucketCommand({ Bucket: bucketName }));
  return true;
}

/**
 * List files inside a bucket (aws s3 ls s3://bucket-name).
 */
export async function listFiles(
  bucketName: string = DEFAULT_BUCKET,
  prefix?: string
): Promise<{ key: string; size?: number; lastModified?: Date }[]> {
  const client = getS3Client();
  const res = await client.send(
    new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
    })
  );
  return (res.Contents || []).map((item: _Object) => ({
    key: item.Key || "",
    size: item.Size,
    lastModified: item.LastModified,
  }));
}

/**
 * Upload a buffer or stream to a bucket (aws s3 cp file s3://bucket/file).
 */
export async function uploadObject(
  key: string,
  body: Buffer | Uint8Array | Blob | string,
  contentType?: string,
  bucketName: string = DEFAULT_BUCKET
): Promise<{ key: string; url: string }> {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body as PutObjectCommandInput["Body"],
      ContentType: contentType,
    })
  );

  // Appwrite S3 direct URL format
  const url = `${ENDPOINT_URL}/${bucketName}/${encodeURIComponent(key)}`;
  return { key, url };
}

/**
 * Delete a file from a bucket (aws s3 rm s3://bucket/file).
 */
export async function deleteObject(
  key: string,
  bucketName: string = DEFAULT_BUCKET
): Promise<boolean> {
  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
  return true;
}

/**
 * Remove a bucket, optionally force-deleting all contents first (aws s3 rb s3://bucket --force).
 */
export async function deleteBucket(
  bucketName: string,
  force: boolean = false
): Promise<boolean> {
  const client = getS3Client();

  if (force) {
    const files = await listFiles(bucketName);
    if (files.length > 0) {
      await client.send(
        new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: files.map((f) => ({ Key: f.key })),
          },
        })
      );
    }
  }

  await client.send(new DeleteBucketCommand({ Bucket: bucketName }));
  return true;
}

/**
 * Generate a pre-signed URL for client-side direct uploads.
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 3600,
  bucketName: string = DEFAULT_BUCKET
): Promise<string> {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Generate a pre-signed URL for direct downloads.
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 3600,
  bucketName: string = DEFAULT_BUCKET
): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

