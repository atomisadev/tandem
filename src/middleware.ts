import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (pathname.startsWith("/dashboard") && !sessionCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (
        (pathname === "/login" ||
            pathname === "/sign-in" ||
            pathname === "/sign-up") &&
        sessionCookie
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/sign-in", "/sign-up"],
};
