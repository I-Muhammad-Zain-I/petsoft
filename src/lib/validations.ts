import { z } from "zod";

const petIdSchema = z.string().uuid();

const petFormSchema = z.object({
  name: z.string().min(1, { message: "Name is Required" }).max(100),
  ownerName: z.string().min(1, { message: "Owner Name is Required" }).max(100),
  imageUrl: z.union([z.literal(""), z.string().trim()]),
  age: z.coerce.number().int().positive().max(999),
  notes: z.union([
    z.literal(""),
    z.string().min(1, { message: "Notes is Required" }).max(1000),
  ]),
});

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Valid password is required",
  }),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, {
    message: "Valid password is required",
  }),
  code: z.optional(z.string()),
});
const SignupSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
});

// const RegisterSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(1, {
//     message: "Valid password is required",
//   }),
// });

export type PetFormType = z.infer<typeof petFormSchema>;

export {
  petFormSchema,
  petIdSchema,
  AuthSchema,
  LoginSchema,
  SignupSchema,
  ResetSchema,
  NewPasswordSchema,
};
