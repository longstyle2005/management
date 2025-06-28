import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            nickname?: string | null;
            email?: string | null;
            avatar?: string | null;
            role?: string;
        };
    }

    interface User {
        id: string;
        name?: string | null;
        nickname?: string | null;
        email?: string | null;
        avatar?: string | null;
        role?: string;
    }
}