// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// next-auth v4's withAuth helper has trouble on newer Next versions, so we do
// the token check ourselves - it's small and a lot easier to reason about.
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/auth/login", req.url);
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Protect the signed-in areas
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tracker/:path*",
    "/onboarding/:path*"
  ]
};
