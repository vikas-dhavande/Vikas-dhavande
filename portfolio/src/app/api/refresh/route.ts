import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization");
    const querySecret = req.nextUrl.searchParams.get("secret");
    const isAuthorized =
      authHeader === `Bearer ${secret}` || querySecret === secret;

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const startTime = Date.now();
  try {
    // Invalidate full page cache and static shells for the portfolio
    revalidatePath("/", "layout");

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: "Portfolio layout and animation pipelines successfully refreshed.",
      timestamp: new Date().toISOString(),
      durationMs: duration,
      revalidated: ["/", "layout"],
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

export async function GET(req: NextRequest) {
  return POST(req);
}
