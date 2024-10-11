"use server";

import prisma from "./db";
import { revalidatePath } from "next/cache";
import { sleep } from "./utils";
import { PetEssentials } from "../../types";
import { AuthSchema, petFormSchema, petIdSchema } from "./validations";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/auth-routes";
import { signIn } from "@/auth";
import { z } from "zod";
import { getUserByEmail } from "./utilities/user";
import bcrypt from "bcryptjs";

// USER

const signUp = async (signUpData: z.infer<typeof AuthSchema>) => {
  const validatedFields = AuthSchema.safeParse(signUpData);

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    };
  }

  const { email, password } = validatedFields.data;

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
      email,
      hashedPassword,
    },
  });

  return {
    success: "User Created Successfully",
  };
};

const login = async (loginData: z.infer<typeof AuthSchema>) => {
  const validatedFields = AuthSchema.safeParse(loginData);

  if (!validatedFields.success) {
    return {
      error: "Invalid Fields",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.log("Found Error");
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.log("returning invalid credentials");
          return { error: "Invalid credentials" };
        case "CredentialsSignin":
          throw new Error("Invalid Credentials");
        default:
          console.error("An error occurred", error);
          return { error: "An error occurred" };
      }
    }

    // When using try/catch in Server Actions you should always rethrow the error otherwise it will not be redirected
    throw error;
  }
};

// PET

const addPet = async (pet: unknown) => {
  await sleep(1000);

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid Pet Data",
    };
  }
  try {
    // console.log(pet);
    await prisma.pet.create({
      data: pet,
    });
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
  revalidatePath("/app", "layout");
};

const editPet = async (pet: unknown, id: unknown) => {
  await sleep(1000);
  const validatedPet = petFormSchema.safeParse(pet);
  const validatedId = petIdSchema.safeParse(id);
  if (!validatedPet.success || !validatedId.success) {
    return {
      message: "Invalid Pet Data",
    };
  }

  try {
    await prisma.pet.update({
      where: {
        id: id,
      },
      data: validatedPet.data,
    });
  } catch (err) {
    console.log(err);
    // toast.warning("Unable to edit Pets");
    return { error: err.message };
  }
  revalidatePath("/app", "layout");
};

const deletePet = async (id: unknown) => {
  await sleep(1000);
  const validatedId = petIdSchema.safeParse(id);
  if (!validatedId.success) {
    return {
      message: "Invalid Pet Data",
    };
  }

  try {
    await prisma.pet.delete({
      where: { id: validatedId.data },
    });
  } catch (err) {
    console.log(err);
    return { error: err.message };
  }
  revalidatePath("/app", "layout");
};

export { addPet, editPet, deletePet, login, signUp };
