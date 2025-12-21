import { z } from "zod";

export const createBeneficiaryGroupSchema = (t: (key: string) => string) =>
  z.object({
    groupName: z.string(),
    beneficiaryIds: z.array(z.string())
      .optional()
      .default([]),
  });

export type CreateBeneficiaryGroupModel = z.infer<ReturnType<typeof createBeneficiaryGroupSchema>>;
