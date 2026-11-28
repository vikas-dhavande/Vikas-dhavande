import { NextResponse, NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import { emitServerLog, SeverityNumber } from "@/lib/server-logger";

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  const clientIp =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  const timestamp = new Date().toISOString();

  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || secret.trim() === "") {
    console.error(
      `[AUDIT] ${timestamp} - Revalidation rejected: REVALIDATE_SECRET is unconfigured. IP=${clientIp}`
    );
    emitServerLog("Revalidation rejected: REVALIDATE_SECRET is unconfigured", SeverityNumber.ERROR, {
      endpoint: "/api/refresh",
      method: "POST",
      clientIp,
    });
    return NextResponse.json(
      { error: "Revalidation endpoint disabled (REVALIDATE_SECRET not configured)" },
      { status: 503 }
    );
  }

  const authHeader = req.headers.get("authorization") || "";
  const querySecret = req.nextUrl.searchParams.get("secret") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : querySecret.trim();

  const isAuthorized = Boolean(token && timingSafeEqualStr(token, secret));

  if (!isAuthorized) {
    console.warn(
      `[AUDIT] ${timestamp} - Unauthorized revalidation attempt from IP=${clientIp}, UA="${userAgent}"`
    );
    emitServerLog("Unauthorized cache revalidation attempt", SeverityNumber.WARN, {
      endpoint: "/api/refresh",
      method: "POST",
      clientIp,
      userAgent,
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  try {
    revalidatePath("/", "layout");
    const duration = Date.now() - startTime;

    console.info(
      `[AUDIT] ${timestamp} - Cache revalidation successful. Duration=${duration}ms, IP=${clientIp}`
    );
    emitServerLog("Portfolio cache revalidation succeeded", SeverityNumber.INFO, {
      endpoint: "/api/refresh",
      method: "POST",
      clientIp,
      durationMs: duration,
    });

    return NextResponse.json({
      success: true,
      message: "Portfolio layout and cache successfully refreshed.",
      timestamp,
      durationMs: duration,
      revalidated: ["/", "layout"],
    });
  } catch (error) {
    console.error(
      `[AUDIT] ${timestamp} - Cache revalidation failed with error:`,
      error
    );
    emitServerLog("Portfolio cache revalidation failed", SeverityNumber.ERROR, {
      endpoint: "/api/refresh",
      method: "POST",
      clientIp,
      error: error instanceof Error ? error.message : "Refresh failed",
    });
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
  return NextResponse.json(
    { error: "Method Not Allowed. Cache revalidation must be triggered via POST with proper authorization." },
    { status: 405, headers: { Allow: "POST" } }
  );
}

