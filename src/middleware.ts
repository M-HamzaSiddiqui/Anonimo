import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Allow public access to form response submission and thank-you page
  const isPublicFormPage =
    url.pathname.match(/^\/forms\/[^\/]+$/) || // Matches /forms/[slug]
    url.pathname === "/forms/thank-you"; // Matches /forms/thank-you

  if (isPublicFormPage) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from sign-in/up pages
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Require authentication for protected routes
  if (!token && (
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/forms") ||
    url.pathname === "/create-form"
  ))  {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

// ✅ Middleware applies to all protected routes
export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/dashboard/:path*",
    "/forms/:path*", // Protect forms by default
    "/create-form"
  ],
};
