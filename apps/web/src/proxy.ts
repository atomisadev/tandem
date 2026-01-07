import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  const authRoutes = ["/sign-in", "/sign-up", "/"];
  const isAuthRoute = authRoutes.includes(pathname);
  const isRoot = pathname === "/";

  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (sessionToken && (isAuthRoute || isRoot)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!sessionToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
