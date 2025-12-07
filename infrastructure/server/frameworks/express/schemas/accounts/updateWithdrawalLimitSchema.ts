import z from "zod";

export const updateWithdrawalLimitSchema = z.object({
    withdrawalLimit: z.number(),
});