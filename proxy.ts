import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicAdminPaths = new Set(["/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSessionCookie = Boolean(getSessionCookie(request));

  if (publicAdminPaths.has(pathname)) {
    return hasSessionCookie ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }

  if (!hasSessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };

