"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function revalidateTagAction(tag: string) {
  try {
    revalidateTag(tag);
    return { success: true, message: `Successfully revalidated tag: "${tag}"`, timestamp: new Date().toISOString() };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function revalidatePathAction(path: string) {
  try {
    revalidatePath(path);
    return { success: true, message: `Successfully revalidated path: "${path}"`, timestamp: new Date().toISOString() };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function setCookiePreferenceAction(key: string, value: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(key, value, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false,
      sameSite: "lax",
    });
    revalidatePath("/");
    return { success: true, key, value };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
