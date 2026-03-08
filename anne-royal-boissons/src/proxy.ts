import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AGE_GATE_COOKIE = "age_verified";
const AGE_GATE_PATH = "/age-verification";

// Public paths that don't need age gate
const PUBLIC_PATHS = [
  AGE_GATE_PATH,
  "/api/auth",
  "/api/fedapay",
  "/mentions-legales",
  "/cgv",
  "/_next",
  "/favicon.ico",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static/api paths
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath) return NextResponse.next();

  // ── Age Gate check ──────────────────────────────────────────────
  if (!pathname.startsWith("/admin")) {
    const ageVerified = request.cookies.get(AGE_GATE_COOKIE)?.value;
    if (!ageVerified || ageVerified !== "true") {
      const ageGateUrl = new URL(AGE_GATE_PATH, request.url);
      ageGateUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(ageGateUrl);
    }
  }

  // ── Admin auth check ─────────────────────────────────────────────
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.png$|.*\\.jpe?g$|.*\\.svg$|.*\\.webp$|.*\\.gif$|.*\\.ico$).*)",
  ],
};
