import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./server/config/db";
import authConfig from "./auth.config";
import { getUserById } from "./server/data/user";
import { getAccountByUserId } from "./server/data/account";
import { getTwoFactorConfirmationByUserId } from "./server/data/two-factor-confirmation";

declare module "next-auth" {
  interface Session {
    user: {
      role: "ADMIN" | "USER";
      email: string;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
      hasCompletedPayment: boolean;
    } & DefaultSession["user"];
  }
}

/**
 * This might change in future as per doc-string in "@auth/core/jwt"
 */
declare module "@auth/core/jwt" {
  interface JWT {
    role: "ADMIN" | "USER";
    hasCompletedPayment: boolean;
    email: string;
    isOAuth: boolean;
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
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // if user does not exists
      if (!user.id) return false;

      const existingUser = await getUserById(user.id);

      // Prevents sign in if email is unverified
      if (!existingUser?.emailVerified) return false;

      // Checking if 2FA is enabled
      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        /**
         * Delete two factor confirmation for next time ->
         * so user would need to do 2FA again
         */

        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.hasCompletedPayment = token.hasCompletedPayment;
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

      // Payment checking in middleware
      token.hasCompletedPayment = existingUser.hasCompletedPayment;

      // hotfix -> sqlite does not support enums
      token.role = existingUser.role as "ADMIN" | "USER";
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  ...authConfig,
});
