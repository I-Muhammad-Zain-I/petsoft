import prisma from "../config/db";

const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      {
        where: { userId }, // findBy userId since {@relation} is defined in the model
      }
    );
    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};

export { getTwoFactorConfirmationByUserId };
