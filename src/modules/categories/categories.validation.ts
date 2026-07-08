import z from "zod";

export const addCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(1, "name is required"),
    sortDescriptoin: z.string().optional(),
  }),
});
