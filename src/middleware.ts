import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({req,secret: process.env.NEXTAUTH_SECRET,}) as Record<string, any> | null;
    const { pathname } = req.nextUrl;

    // If not logged in
    // if (!token && pathname.startsWith("/admin")) {
    //     return NextResponse.redirect(new URL("/", req.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|img/).*)",
    ],
};