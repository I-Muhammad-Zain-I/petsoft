import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./constants";

const petIdSchema = z.string().uuid();

const petFormSchemaPostUpload = z.object({
  name: z.string().min(1, { message: "Name is Required" }).max(100),
  ownerName: z.string().min(1, { message: "Owner Name is Required" }).max(100),
  imageUrl: z.union([z.literal(""), z.string().trim()]),
  imageId: z.union([z.literal(""), z.string(), z.null()]),
  age: z.coerce.number().int().positive().max(999),
  notes: z.union([
    z.literal(""),
    z.string().min(1, { message: "Notes is Required" }).max(1000),
  ]),
});

const petFormSchemaPreUpload = z.object({
  name: z.string().min(1, { message: "Name is Required" }).max(100),
  ownerName: z.string().min(1, { message: "Owner Name is Required" }).max(100),
  age: z.coerce.number().int().positive().max(999),
  notes: z.union([
    z.literal(""),
    z.string().min(1, { message: "Notes is Required" }).max(1000),
  ]),
  image: z
    .custom<FileList>((files) => {
      if (files instanceof FileList) {
        // check the size of the first file if it exists
        return files.length === 0 || files[0]?.size <= MAX_FILE_SIZE;
      }
      return false; // Return false if it's not a FileList
    }, "Must be a valid FileList.")
    .refine(
      (files) => files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (files) =>
        files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
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

export type PetFormType = z.infer<typeof petFormSchemaPreUpload>;

export {
  petFormSchemaPostUpload,
  petIdSchema,
  LoginSchema,
  SignupSchema,
  ResetSchema,
  NewPasswordSchema,
  petFormSchemaPreUpload,
};

// const petFormSchema = z.object({
//   name: z.string().min(1, { message: "Name is Required" }).max(100),
//   ownerName: z.string().min(1, { message: "Owner Name is Required" }).max(100),
//   age: z.coerce.number().int().positive().max(999),
//   notes: z.union([
//     z.literal(""),
//     z.string().min(1, { message: "Notes is Required" }).max(1000),
//   ]),
//   image: z
//     .union([
//       z
//         .object({
//           file: z
//             .instanceof(FileList)
//             .refine(
//               (files) => !files.length || files?.[0]?.size <= MAX_FILE_SIZE, // Allow empty or valid files
//               `Max image size is 5MB.`
//             )
//             .refine(
//               (files) =>
//                 !files.length ||
//                 ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
//               "Only .jpg, .jpeg, .png and .webp formats are supported."
//             )
//             .optional(), // Make it optional
//         })
//         .optional(), // Make the whole object optional
//       z.string().url({ message: "Image URL must be a valid URL" }).optional(), // URL also optional
//     ])
//     .optional(), // Optional if no image is provided
// });
// const petFormSchema = z.object({
//   name: z.string().min(1, { message: "Name is Required" }).max(100),
//   ownerName: z.string().min(1, { message: "Owner Name is Required" }).max(100),
//   imageUrl: z.union([z.literal(""), z.string().trim()]),
//   age: z.coerce.number().int().positive().max(999),
//   notes: z.union([
//     z.literal(""),
//     z.string().min(1, { message: "Notes is Required" }).max(1000),
//   ]),
// });
