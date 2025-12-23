import { z } from "zod";

export const addBeneficiaryToGroupSchema = (t: (key: string) => string) =>
  z.object({
    beneficiaryId: z.string()
  });

export type AddBeneficiaryToGroupModel = z.infer<ReturnType<typeof addBeneficiaryToGroupSchema>>;
