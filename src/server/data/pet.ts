import prisma from "../config/db";

const getPetsByUserId = async (userId: number) => {
  let pets = [];

  try {
    pets = await prisma?.pet.findMany({
      where: {
        userId: userId!,
      },
    });
  } catch (error) {
    console.log(error);
  }

  return pets;
};

export { getPetsByUserId };
