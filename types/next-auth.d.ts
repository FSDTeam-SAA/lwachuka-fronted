import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            role: string;
            status: string;
            accessToken: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        _id: string;
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        firstName: string;
        lastName: string;
        role: string;
        status: string;
        accessToken: string;
    }
}



