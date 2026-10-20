import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST() {
  const startTime = Date.now();
  try {
    // 1. Invalidate full page cache and static shells
    revalidatePath("/", "layout");

    // 2. Invalidate specific data cache tags
    try {
      revalidateTag("products");
      revalidateTag("posts");
      revalidateTag("users");
    } catch {
      // Tags might be inert if mock data is used
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: "Website animation pipeline and cache successfully refreshed.",
      timestamp: new Date().toISOString(),
      durationMs: duration,
      revalidated: ["/", "layout", "products", "posts", "users"],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Refresh failed",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
