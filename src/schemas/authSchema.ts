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
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      )
      .trim(),

    confirmPassword: z.string().min(6, "Confirm Password is required.").trim(),

    name: z
      .string()
      .min(1, "Name is required")
      .max(50, "Name is too long!")
      .trim(),

    profileImage: z
      .string()
      .trim()
      .url("Invalid URL format")
      .startsWith("https://", "Picture URL must start with 'https://'")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
