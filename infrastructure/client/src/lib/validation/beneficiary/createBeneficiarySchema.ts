import { z } from "zod";

export const createBeneficiarySchema = (t: (key: string) => string) =>
  z.object({
    iban: z.string().min(1, t("validation.iban.required")),
    beneficiaryName: z.string().min(1, t("validation.beneficiaryName.required")),
    country: z.string().min(1, t("validation.country.required")),
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
        message: t("validation.address.fieldsRequired"),
        path: ["address"],
      }
    );

export type CreateBeneficiaryModel = z.infer<ReturnType<typeof createBeneficiarySchema>>;
