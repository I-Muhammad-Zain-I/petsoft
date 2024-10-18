import prisma from "../config/db";

const getAccountByUserId = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        userId,
      },
    });
    return account;
  } catch (error) {
    return null;
  }
};

export { getAccountByUserId };
