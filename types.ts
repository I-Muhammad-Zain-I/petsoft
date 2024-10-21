import { Pet } from "@prisma/client";

export type PetEssentials = Omit<Pet, "createdAt" | "updatedAt" | "userId">;
