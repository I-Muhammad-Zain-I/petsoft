import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./lib/utilities/user";
import { getAccountByUserId } from "./lib/utilities/account";

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
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as Boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },

    async jwt({ token }) {
      // no token -> userLoggedOut
      if (!token) return token;

      // sub is alias for id
      const existingUser = await getUserById(token.sub!);

      // when user is non-existent as per token information
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = Boolean(existingAccount);
      token.name = existingUser.name;
      token.email = existingUser.email;
      // hotfix -> sqlite does not support enums
      token.role = existingUser.role as "ADMIN" | "USER";
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  ...authConfig,
});
