"use server";
import { getUserByEmail } from "@/server/data/user";
import prisma from "@/server/config/db";
import { getVerificationTokenByToken } from "@/server/data/verification-token";

const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  // Token in url can be changed
  if (!existingToken) {
    return { error: "Token does not exists" };
  }

  // if token exists then check if it is expired

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has Expired" };
  }

  // if token is valid and un-expired check if user exists

  const existingUser = await getUserByEmail(existingToken.email);

  // one case is that user may have changed their email
  if (!existingUser) {
    return { error: "Email does not exists" };
  }

  // if user exists and token is valid then update verification status
  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return { success: "email Verified" };
};

export { newVerification };
