import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import api from "@/lib/api";

type ApiErrorSource = {
    message?: string;
};

type ApiErrorResponse = {
    message?: string;
    error?: string;
    errorSources?: ApiErrorSource[];
};

const extractMessageFromApi = (data: unknown): string | null => {
    if (!data) return null;
    if (typeof data === "string") {
        return data.trim() || null;
    }

    if (typeof data !== "object") return null;
    const typed = data as ApiErrorResponse;

    const sources = Array.isArray(typed.errorSources)
        ? typed.errorSources
              .map(source => (typeof source?.message === "string" ? source.message.trim() : ""))
              .filter(Boolean)
        : [];

    if (sources.length > 0) return sources.join("||");
    if (typeof typed.message === "string" && typed.message.trim()) return typed.message.trim();
    if (typeof typed.error === "string" && typed.error.trim()) return typed.error.trim();

    return null;
};

const getAuthErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const apiMessage = extractMessageFromApi(error.response?.data);
        if (apiMessage) return apiMessage;

        if (error.code === "ERR_NETWORK") return "Unable to reach the server. Please try again.";
        if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
        if (error.response?.status === 401) return "Invalid email or password.";
        if (error.message) return error.message;
    }

    if (error instanceof Error && error.message) return error.message;
    return "Login failed";
};

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

                    if (data?.success && data?.data) {
                        const { user, accessToken } = data.data;
                        return {
                            id: user._id,
                            _id: user._id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            status: user.status,
                            accessToken: accessToken,
                        };
                    }
                    const message = extractMessageFromApi(data);
                    if (message) {
                        throw new Error(message);
                    }
                    return null;
                } catch (error: unknown) {
                    const message = getAuthErrorMessage(error);
                    console.error("Login failed:", message);
                    throw new Error(message);
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
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
};
