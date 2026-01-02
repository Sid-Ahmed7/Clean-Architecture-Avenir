import { z } from "zod";

export const addressSchema = (t: (key: string) => string) =>
  z.object({
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
  });

export type AddressModel = z.infer<ReturnType<typeof addressSchema>>;
