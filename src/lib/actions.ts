"use server";
import { PetType } from "../../types";
import prisma from "./db";
import dogAvatar from "../../public/dogAvatar.svg";
import { revalidatePath } from "next/cache";
import { sleep } from "./utils";

const addPet = async (formData: FormData) => {
  await sleep(2000);
  await prisma.pet.create({
    data: {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl: (formData.get("imageUrl") as string) || dogAvatar.src,
      age: parseInt(formData.get("age") as string),
      notes: formData.get("notes") as string,
    },
  });
  revalidatePath("/app", "layout");
};

export { addPet };
