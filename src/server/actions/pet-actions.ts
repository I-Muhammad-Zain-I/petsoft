"use server";
import { sleep } from "@/lib/utils";
import { petFormSchemaPostUpload, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import prisma from "@/server/config/db";
import { Pet, Prisma } from "@prisma/client";

const addPet = async (pet: unknown, userId: string) => {
  await sleep(1000);

  const validatedPet = petFormSchemaPostUpload.safeParse(pet);

  if (userId === undefined) {
    return {
      error: "User Id undefined, Cannot Add Pet",
    };
  }

  if (!validatedPet.success) {
    return {
      error: "Invalid Pet Data",
    };
  }
  try {
    // console.log(pet);
    await prisma.pet.create({
      data: {
        ...pet,
        userId: userId,
      },
    });
  } catch (err) {
    console.log("Error Logged Here..........");
    console.log(err);
    return { error: err.name };
  }
  revalidatePath("/app", "layout");
  return { success: `${pet.name} placed in self care` };
};

const editPet = async (pet: unknown, id: unknown) => {
  await sleep(1000);
  const validatedPet = petFormSchemaPostUpload.safeParse(pet);
  const validatedId = petIdSchema.safeParse(id);
  if (!validatedPet.success || !validatedId.success) {
    return {
      error: "Invalid Pet Data",
    };
  }

  /**
   * Hotfix for image url as Prisma.skip is in preview thus using undefined to skip field updates
   */

  let imageUrl =
    validatedPet.data.imageUrl === "" ? undefined : validatedPet.data.imageUrl;

  console.log("imageUrl", imageUrl);

  try {
    await prisma.pet.update({
      where: {
        id: id,
      },
      data: {
        ...validatedPet.data,
        imageUrl: imageUrl,
      },
    });
  } catch (err) {
    console.log(err);
    // toast.warning("Unable to edit Pets");
    return { error: err.name };
  }
  revalidatePath("/app", "layout");
  return { success: "Pet Details edited Successfully" };
};

const deletePet = async (id: unknown) => {
  await sleep(1000);
  const validatedId = petIdSchema.safeParse(id);
  if (!validatedId.success) {
    return {
      error: "Invalid Pet Data",
    };
  }

  try {
    await prisma.pet.delete({
      where: { id: validatedId.data },
    });
  } catch (err) {
    console.log(err);
    return { error: err.name };
  }
  revalidatePath("/app", "layout");
  return { success: "Pet removed from self care" };
};

const getPetImageId = async (petId: string) => {
  let pet: Pet = "";

  try {
    pet = await prisma.pet.findFirst({
      where: {
        id: petId,
      },
    });
  } catch (err) {
    console.log(err);
    return { error: err.name };
  }
  return pet?.imageId;
};

export { addPet, editPet, deletePet, getPetImageId };
