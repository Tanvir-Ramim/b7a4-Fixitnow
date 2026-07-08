import z from "zod";

export const createServicesValidation = z.object({
  body: z.object({
    title: z.string().min(1, "title date is required"),
    description: z.string().optional(),
    price: z.number().min(0, "price cannot be negative"),
    categoryId: z.string().min(1, "Category ID cannot be empty"),
  }),
});
