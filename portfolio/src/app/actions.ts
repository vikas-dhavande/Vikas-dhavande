"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import { emitServerLog, SeverityNumber } from "@/lib/server-logger";

function isAuthorized(secret?: string): boolean {
  const serverSecret = process.env.REVALIDATE_SECRET;
  if (!serverSecret || !secret) return false;
  const bufA = Buffer.from(secret);
  const bufB = Buffer.from(serverSecret);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const ALLOWED_COOKIE_KEYS = new Set(["theme", "avatar_seed", "auth_user"]);
const ALLOWED_THEME_VALUES = new Set(["light", "dark", "system", "cyberpunk", "looseleaf"]);

export async function revalidateTagAction(tag: string, secret?: string) {
  if (!isAuthorized(secret)) {
    emitServerLog("Unauthorized tag revalidation attempt", SeverityNumber.WARN, {
      action: "revalidateTagAction",
      tag,
    });
    return { success: false, message: "Unauthorized: Invalid revalidation token" };
  }
  try {
    revalidateTag(tag);
    emitServerLog("Tag revalidated", SeverityNumber.INFO, {
      action: "revalidateTagAction",
      tag,
    });
    return {
      success: true,
      message: `Successfully revalidated tag: "${tag}"`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const message = (error as Error).message;
    emitServerLog("Tag revalidation failed", SeverityNumber.ERROR, {
      action: "revalidateTagAction",
      tag,
      error: message,
    });
    return { success: false, message };
  }
}

export async function revalidatePathAction(path: string, secret?: string) {
  if (!isAuthorized(secret)) {
    emitServerLog("Unauthorized path revalidation attempt", SeverityNumber.WARN, {
      action: "revalidatePathAction",
      path,
    });
    return { success: false, message: "Unauthorized: Invalid revalidation token" };
  }
  try {
    revalidatePath(path);
    emitServerLog("Path revalidated", SeverityNumber.INFO, {
      action: "revalidatePathAction",
      path,
    });
    return {
      success: true,
      message: `Successfully revalidated path: "${path}"`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    const message = (error as Error).message;
    emitServerLog("Path revalidation failed", SeverityNumber.ERROR, {
      action: "revalidatePathAction",
      path,
      error: message,
    });
    return { success: false, message };
  }
}

export async function setCookiePreferenceAction(key: string, value: string) {
  if (!ALLOWED_COOKIE_KEYS.has(key)) {
    return { success: false, message: `Disallowed preference key: "${key}"` };
  }
  if (key === "theme" && !ALLOWED_THEME_VALUES.has(value)) {
    return { success: false, message: `Invalid theme value: "${value}"` };
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set(key, value, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return { success: true, key, value };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function clearCookieAction(key: string) {
  if (!ALLOWED_COOKIE_KEYS.has(key)) {
    return { success: false, message: `Disallowed preference key: "${key}"` };
  }

  try {
    const cookieStore = await cookies();
    cookieStore.delete(key);
    return { success: true, key };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

