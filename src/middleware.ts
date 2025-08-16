import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({req,secret: process.env.NEXTAUTH_SECRET,}) as Record<string, any> | null;
    const { pathname } = req.nextUrl;

    if (!token && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (token && pathname === "/") {
        return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|img/).*)",
    ],
};