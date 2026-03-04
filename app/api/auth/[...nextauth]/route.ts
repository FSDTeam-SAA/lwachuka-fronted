import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/api";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                try {
                    const res = await api.post("/auth/login", {
                        email: credentials.email,
                        password: credentials.password,
                    });

                    const data = res.data;

                    if (data.success && data.data) {
                        const { user, accessToken } = data.data;
                        return {
                            id: user._id, // Required by NextAuth
                            _id: user._id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            status: user.status,
                            accessToken: accessToken,
                        };
                    }
                    return null;
                } catch (error: any) {
                    console.error("Login failed:", error?.response?.data || error.message);
                    throw new Error(error?.response?.data?.message || "Login failed");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token._id = user._id;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.role = user.role;
                token.status = user.status;
                token.accessToken = user.accessToken;
            }

            // Update session if requested (e.g. after profile update)
            if (trigger === "update" && session) {
                return { ...token, ...session.user };
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user.role = token.role;
                session.user.status = token.status;
                session.user.accessToken = token.accessToken;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
