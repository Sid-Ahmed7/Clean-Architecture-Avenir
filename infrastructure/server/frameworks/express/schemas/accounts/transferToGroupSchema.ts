import z from "zod";

export const transferToGroupSchema = z.object({
    groupId: z.string(),
    sourceAccountNumber: z.number(),
    amountPerBeneficiary: z.number(),
});
