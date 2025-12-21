import { z } from "zod";

export const transferToBeneficiarySchema = (t: (key: string) => string) =>
  z.object({
    beneficiaryId: z.string(),
    sourceAccountNumber: z.number(),
    amount: z.number()
  });

export type TransferToBeneficiaryModel = z.infer<ReturnType<typeof transferToBeneficiarySchema>>;
