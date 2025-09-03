import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const PUBLIC_PATHS = new Set([
  "/login",
  "/setup",         
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (
    PUBLIC_PATHS.has(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Not logged in → send to /login
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(url);
  }

  // ✅ Check if profile exists with preferred_name
  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_name")
    .eq("id", session.user.id)
    .maybeSingle();

  // No profile or no preferred_name → send to /setup
  if (!profile?.preferred_name && pathname !== "/setup") {
    const url = req.nextUrl.clone();
    url.pathname = "/setup";
    return NextResponse.redirect(url);
  }

  return res;
}
