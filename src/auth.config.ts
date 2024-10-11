import Credentials, {
  CredentialInput,
  CredentialsConfig,
} from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./lib/db";

import type { NextAuthConfig } from "next-auth";

const authorize = async (
  credentials: Partial<CredentialsConfig<Record<string, CredentialInput>>>
) => {
  const { email, password } = credentials;
  console.log(email, password);

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    console.log("USER Does not exists");
    return null;
  }

  const doesPasswordMatch = bcrypt.compare(password, user.hashedPassword);

  if (!doesPasswordMatch) {
    console.log("Invalid password");
    return null;
  }

  return user;
};

export default {
  providers: [Credentials({ authorize })],
} satisfies NextAuthConfig;