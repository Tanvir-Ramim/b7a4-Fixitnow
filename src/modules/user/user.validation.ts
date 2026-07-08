import { z } from "zod";


export const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name cannot exceed 255 characters")
      .optional(),

    profilePhoto: z
      .string()
      .url("Profile photo must be a valid URL")
      .optional(),

    bio: z
      .string()
      .trim()
      .max(10000, "Bio cannot exceed 1000 characters")
      .optional(),

    experience: z.number().min(0, "Experience cannot be negative").optional(),

    skills: z
      .array(z.string().trim().min(1, "Skill cannot be empty"))
      .optional(),
  }),
});




export const createAvailabilityValidation = z.object({
  body: z.object({
    slotDate: z.string().min(1, "Slot date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required")
  })
});