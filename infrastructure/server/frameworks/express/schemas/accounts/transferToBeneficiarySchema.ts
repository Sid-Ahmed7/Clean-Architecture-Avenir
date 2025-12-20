import z from "zod";

export const transferToBeneficiarySchema = z.object({
    beneficiaryId: z.string(),
    sourceAccountNumber: z.number(),
    amount: z.number(),
});
