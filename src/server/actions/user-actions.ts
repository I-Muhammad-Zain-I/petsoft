"use server";
import { sendTwoFactorTokenEmail, sendVerifcationEmail } from "@/lib/mail";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/server/data/token";
import { getUserByEmail } from "@/server/data/user";
import { LoginSchema, SignupSchema } from "@/lib/validations";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/server/config/db";
import { DEFAULT_LOGIN_REDIRECT } from "@/auth-routes";
import { isRedirectError } from "next/dist/client/components/redirect";
import { getTwoFactorTokenByEmail } from "../data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "../data/two-factor-confirmation";
import { signOut } from "@/auth";

const signUp = async (signUpData: z.infer<typeof SignupSchema>) => {
  const validatedFields = SignupSchema.safeParse(signUpData);

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    };
  }

  const { name, email, password } = validatedFields.data;
  console.table(validatedFields.data);

  // checking if user exists
  const user = await getUserByEmail(email);

  if (user) {
    return {
      error: "Email Invalid",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerifcationEmail(
    verificationToken?.email,
    verificationToken?.token
  );

  return {
    success: "User Created Successfully",
  };
};

const login = async (loginData: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(loginData);

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.hashedPassword || !existingUser.email) {
    return {
      error: "Email does not exists",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerifcationEmail(
      verificationToken?.email,
      verificationToken?.token
    );

    return { success: "Confirmation email Sent" };
  }

  // 2FA
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "2FA Token not found" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid 2FA Token" };
      }

      const hasExpired = twoFactorToken.expires < new Date();
      if (hasExpired) {
        return { error: "2FA Token expired" };
      }

      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  // in try/catch sigin will through error so that re-direction can occur -> normal behavior
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.log("Found Error");
    console.log(error);
    // if (isRedirectError(error)) throw error;
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.log("returning invalid credentials");
          return { error: "Invalid Credentials" };
        default:
          console.error("An error occurred", error);
          return { error: "An error occurred" };
      }
    }

    // When using try/catch in Server Actions you should always rethrow the error otherwise it will not be redirected
    throw error;
  }
};

const logout = async () => {
  await signOut({ redirectTo: "/login" });
};

export { signUp, login, logout };
