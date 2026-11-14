import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes from unauthenticated access at the edge (R-01, R-02)
  if (pathname.startsWith("/admin")) {
    const cookies = request.cookies.getAll();
    const hasAppwriteSession = cookies.some(
      (c) => c.name.startsWith("a_session_") || c.name === "auth_user"
    );

    if (!hasAppwriteSession) {
      const redirectUrl = new URL("/", request.url);
      redirectUrl.searchParams.set("auth", "login");
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
