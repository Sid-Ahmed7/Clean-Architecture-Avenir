import { z } from "zod";

export const updateBeneficiarySchema = (t: (key: string) => string) =>
  z.object({
    beneficiaryName: z.string().optional(),
    country: z.string().optional(),
    email: z.string().optional(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      postalCode: z.string(),
    }).optional(),
  }).refine(
    (data) => {
      if (data.address) {
        return data.address.street && data.address.city && data.address.postalCode;
      }
      return true;
    },
    {
      message: "Si vous fournissez une adresse, tous les champs (rue, ville, code postal) sont obligatoires",
      path: ["address"],
    }
  );

export type UpdateBeneficiaryModel = z.infer<ReturnType<typeof updateBeneficiarySchema>>;
