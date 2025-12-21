import { z } from "zod";
import { addressSchema } from "./addressSchema";

export const createBeneficiarySchema = (t: (key: string) => string) =>
  z.object({
    iban: z.string(),
    beneficiaryName: z.string(),
    email: z.string().optional(),
    country: z.string().optional(),
    address: addressSchema(t).optional(),
  });

export type CreateBeneficiaryModel = z.infer<ReturnType<typeof createBeneficiarySchema>>;
