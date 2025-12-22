import { z } from "zod";
import { addressSchema } from "./addressSchema";

export const updateBeneficiarySchema = (t: (key: string) => string) =>
  z.object({
    beneficiaryName: z.string().optional(),
    email: z.string().optional(),
    country: z.string().optional(),
    address: addressSchema(t).optional(),
  });

export type UpdateBeneficiaryModel = z.infer<ReturnType<typeof updateBeneficiarySchema>>;
