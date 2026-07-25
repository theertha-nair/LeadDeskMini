import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/session";

// Routes that require a valid admin session.
const PROTECTED_PAGE_PREFIX = "/admin";
const PROTECTED_API_PREFIX = "/api/leads";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedPage = pathname.startsWith(PROTECTED_PAGE_PREFIX);
  // The public lead-capture form does POST /api/leads (unauthenticated, by design).
  // Everything else under /api/leads (GET list, PATCH status) is admin-only.
  const isProtectedApi =
    pathname.startsWith(PROTECTED_API_PREFIX) && req.method !== "POST";

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (isProtectedApi) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/leads/:path*"],
};
