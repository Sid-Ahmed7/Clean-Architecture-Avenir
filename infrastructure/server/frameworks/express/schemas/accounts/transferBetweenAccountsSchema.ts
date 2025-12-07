import z from "zod";

export const transferBetweenAccountsSchema = z.object({
    fromIban: z.string(),
    toIban: z.string(),
    amount: z.number(),
});