import Credentials, {
  CredentialsConfig,
} from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./server/config/db";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";

const authorize = async (credentials: Partial<Record<string, unknown>>) => {
  const { email, password } = credentials;
  console.log(email, password);

  const user = await prisma.user.findUnique({
    where: {
      email: email as string,
    },
  });

  if (!user) {
    console.log("USER Does not exists");
    return null;
  }

  const doesPasswordMatch = await bcrypt.compare(
    password as string,
    user.hashedPassword as string
  );
  console.log("Password Match: ", doesPasswordMatch);
  if (!doesPasswordMatch) {
    console.log("Invalid password");
    return null;
  }

  return user;
};

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({ authorize }),
  ],
} satisfies NextAuthConfig;
