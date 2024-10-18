"use server";
import { ResetSchema } from "@/lib/validations";
import { z } from "zod";
import { getUserByEmail } from "../data/user";
import { generatePasswordResetToken } from "../data/token";
import { sendPasswordResetMail } from "@/lib/mail";

const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email while resetting" };
  }

  const { email } = values;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetMail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  // generate token and send email
  return { success: "Reset email sent" };
};

export { resetPassword };
