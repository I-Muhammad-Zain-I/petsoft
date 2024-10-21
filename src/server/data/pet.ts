import { Pet } from "@prisma/client";
import prisma from "../config/db";

const getPetsByUserId = async (userId: string) => {
  const pets = await prisma?.pet.findMany({
    where: {
      userId: userId!,
    },
  });

  return pets;
};

export { getPetsByUserId };
