import z from "zod";

export const bookingValidation = z.object({
  body: z.object({
    customerNotes: z.string().optional(),
    address: z.string().min(1,"Address should be Not Empty"),
    serviceId: z.string().min(1,"serviceId should be  not empty"),
    slotID: z.string().min(1,"slotID should be  not empty"),
  
  }),
});
