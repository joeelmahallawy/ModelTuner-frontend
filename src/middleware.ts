import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// PAGES THAT DON'T NEED LOGIN
export const UNAUTHENTICATED_PATHS = {
  "/login": `/login`,
  "/": `/`,
};

export function middleware(request: NextRequest) {
  // the next page is login so check if they're already authed
  if (request.nextUrl.pathname === "/login") {
    const jwt = request.cookies.get("jwt");
    // they're already logged in
    if (jwt?.value)
      // so skip login page
      return NextResponse.redirect(new URL(`/models`, request.url), {
        status: 308,
      });
  }

  // user is about to visit a page that needs login
  if (!UNAUTHENTICATED_PATHS[request.nextUrl.pathname]) {
    // the next page IS an authenticated page and requires login
    const jwt = request.cookies.get("jwt");

    // check if not authed, then redirect to login
    if (!jwt) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }
  }

  // default response
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
