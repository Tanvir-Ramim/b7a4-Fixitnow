import z from "zod";

export const bookingValidation = z.object({
  body: z.object({
    customerNotes: z.string().optional(),
    address: z.string().min(1,"Address should be Not Empty"),
    technicianId: z.string().min(1,"technicianId should be  not empty"),
    serviceId: z.string().min(1,"serviceId should be  not empty"),

  }),
});
