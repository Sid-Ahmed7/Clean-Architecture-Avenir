import { z } from "zod";

export const createBeneficiarySchema = (t: (key: string) => string) =>
  z.object({
    iban: z.string().min(1, "IBAN est requis"),
    beneficiaryName: z.string().min(1, "Nom du bénéficiaire est requis"),
    country: z.string().min(1, "Pays est requis"),
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

export type CreateBeneficiaryModel = z.infer<ReturnType<typeof createBeneficiarySchema>>;
