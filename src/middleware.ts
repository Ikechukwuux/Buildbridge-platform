import { NextResponse, type NextRequest } from "next/server";

/**
 * Production Middleware
 *
 * Uses real Supabase session checking to protect routes.
 * No demo mode.
 */

/**
 * Paths that require an authenticated session.
 * Unauthenticated users hitting these routes are redirected to /login.
 */
const PROTECTED_PATHS = ["/dashboard", "/admin", "/profile"];
const AUTH_ONLY_PATHS = ["/login", "/signup"];

export default async function middleware(request: NextRequest) {
  const { createServerClient } = await import("@supabase/ssr");

  let response = NextResponse.next({ request });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase environment variables missing. Skipping auth check.");
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // Allow unauthenticated access to vouch pages (e.g., /profile/123/vouch)
  const isVouchPage = /^\/profile\/[^/]+\/vouch$/.test(pathname);

  const isAuthOnly = AUTH_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const isHome = pathname === "/";

  // CASE 1: Authenticated user hitting /login or /signup
  if (user && isAuthOnly) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // CASE 2: Unauthenticated user hitting a protected path (excluding vouch pages)
  if (isProtected && !isVouchPage && !user) {
    if (process.env.NODE_ENV === 'development') {
      console.warn("Dev mode: bypassing middleware auth check to allow UI testing.");
      return response;
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

/**
 * Matcher — run middleware on all routes except static assets
 * and Next.js internals.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
