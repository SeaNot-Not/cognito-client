import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),

  password: z.string().min(1, "Password is required").trim(),
});

export const signupSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
      .trim(),

    confirmPassword: z.string().min(6, "Confirm Password is required.").trim(),

    name: z.string().min(1, "Name is required").max(50, "Name is too long!").trim(),

    age: z.number().min(18, "You must be 18 years old or older"),

    bio: z.string().max(2000, "Bio must not exceed 2000 characters").trim().optional(),

    // Just for getting the selected file
    // Profile image validation is handled in backend
    selectedProfileImage: z.any().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
