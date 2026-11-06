"use server";

import { Account, Client, ID, Permission, Role, Storage } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

type ProfilePreferences = {
  profileImageFileId?: string;
};

type ProfileField = "name" | "email" | "phone";

function getUserAccount(jwt: string) {
  if (!jwt || jwt.length > 4096) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const endpoint =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://sfo.cloud.appwrite.io/v1";
  const projectId =
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "6ad0f8ab0025a03812f7";
  const client = new Client().setEndpoint(endpoint).setProject(projectId).setJWT(jwt);
  return {
    account: new Account(client),
    storage: new Storage(client),
  };
}

export async function updateProfileFieldAction(
  jwt: string,
  field: ProfileField,
  value: string,
  password?: string
) {
  const { account } = getUserAccount(jwt);
  await account.get();

  const normalizedValue = value.trim();
  if (field === "name") {
    if (!normalizedValue || normalizedValue.length > 128) {
      throw new Error("Name must be between 1 and 128 characters.");
    }
    await account.updateName(normalizedValue);
    return;
  }

  if (!password || password.length > 256) {
    throw new Error("Enter your current password to change your email or phone number.");
  }

  if (field === "email") {
    if (normalizedValue.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)) {
      throw new Error("Enter a valid email address.");
    }
    await account.updateEmail(normalizedValue, password);
    return;
  }

  const normalizedPhone = normalizedValue.replace(/[()\s-]/g, "");
  if (!/^\+[1-9]\d{6,14}$/.test(normalizedPhone)) {
    throw new Error("Enter a valid phone number, including the country code.");
  }
  await account.updatePhone(normalizedPhone, password);
}

export async function uploadProfileImageAction(formData: FormData) {
  const jwt = formData.get("jwt");
  const image = formData.get("image");
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_BUCKET_ID;

  if (typeof jwt !== "string") {
    throw new Error("Your session has expired. Please sign in again.");
  }
  if (!bucketId) {
    throw new Error("Profile image uploads are not configured yet.");
  }
  if (!(image instanceof File)) {
    throw new Error("Choose an image to upload.");
  }
  if (image.size === 0 || image.size > 4 * 1024 * 1024) {
    throw new Error("Choose an image smaller than 4 MB.");
  }

  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensions[image.type];
  if (!extension) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }

  const imageBytes = new Uint8Array(await image.arrayBuffer());
  const isJpeg = imageBytes[0] === 0xff && imageBytes[1] === 0xd8 && imageBytes[2] === 0xff;
  const isPng =
    imageBytes[0] === 0x89 &&
    imageBytes[1] === 0x50 &&
    imageBytes[2] === 0x4e &&
    imageBytes[3] === 0x47 &&
    imageBytes[4] === 0x0d &&
    imageBytes[5] === 0x0a &&
    imageBytes[6] === 0x1a &&
    imageBytes[7] === 0x0a;
  const isWebp =
    imageBytes[0] === 0x52 &&
    imageBytes[1] === 0x49 &&
    imageBytes[2] === 0x46 &&
    imageBytes[3] === 0x46 &&
    imageBytes[8] === 0x57 &&
    imageBytes[9] === 0x45 &&
    imageBytes[10] === 0x42 &&
    imageBytes[11] === 0x50;
  if (
    (extension === "jpg" && !isJpeg) ||
    (extension === "png" && !isPng) ||
    (extension === "webp" && !isWebp)
  ) {
    throw new Error("The selected file does not match its image format.");
  }

  const { account, storage } = getUserAccount(jwt);
  const user = await account.get<ProfilePreferences>();
  const file = await storage.createFile(
    bucketId,
    ID.unique(),
    InputFile.fromBuffer(imageBytes, `profile.${extension}`),
    [
      Permission.read(Role.any()),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ]
  );

  try {
    await account.updatePrefs<ProfilePreferences>({ profileImageFileId: file.$id });
  } catch (error) {
    try {
      await storage.deleteFile(bucketId, file.$id);
    } catch (cleanupError) {
      console.error("Could not remove an unlinked profile image:", cleanupError);
    }
    throw error;
  }

  return { fileId: file.$id };
}
