import { z } from "zod";
import { Role } from "../../../generated/prisma/enums";

export const userValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name cannot exceed 255 characters"),

    email: z.email("Invalid email address").trim().toLowerCase(),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),

    role: z.enum(Role).optional(),

    profilePhoto: z.string().optional(),
  }),
});
export const loginValidationSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password cannot exceed 100 characters"),
  }),
});
