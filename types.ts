import { Pet } from "@prisma/client";
import { FieldError, UseFormRegister } from "react-hook-form";
import { AuthSchema } from "@/lib/validations";
import { z } from "zod";

export type PetEssentials = Omit<
  Pet,
  "id" | "createdAt" | "updatedAt" | "userId"
>;

export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: keyof z.infer<typeof AuthSchema>;
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};
