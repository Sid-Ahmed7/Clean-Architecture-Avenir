import z from "zod";

export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
});