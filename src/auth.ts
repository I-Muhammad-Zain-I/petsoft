import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/db";
import authConfig from "./auth.config";

declare module "next-auth" {
  interface Session {
    user: {
      role: "ADMIN" | "USER";
    } & DefaultSession["user"];
  }
}

/**
 * This might change in future as per doc-string in "@auth/core/jwt"
 */
declare module "@auth/core/jwt" {
  interface JWT {
    role: "ADMIN" | "USER";
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  events: {},
  callbacks: {},
  ...authConfig,
});
