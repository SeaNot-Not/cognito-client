import { z } from "zod";
import { signupSchema } from "./authSchema";

export const updateUserSchema = signupSchema.pick({
  name: true,
  age: true,
  bio: true,
  selectedProfileImage: true,
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
