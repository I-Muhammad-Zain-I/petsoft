"use server";
import { auth } from "@/auth";

const toggleTwoFactor = async () => {
  const session = await auth();

  if (!session) {
    return {
      error: "Unable to perform requested action",
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    };
  }
  let user;
  try {
    user = await prisma?.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        isTwoFactorEnabled: !session.user.isTwoFactorEnabled,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Unable to perform requested action",
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    };
  }

  return { success: "Success", isTwoFactorEnabled: user.isTwoFactorEnabled };
};

export { toggleTwoFactor };
