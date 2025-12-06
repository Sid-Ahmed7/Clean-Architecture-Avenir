import z from "zod";

export const updateOverdraftLimitSchema = z.object({
    overdraftLimit: z.number(),
});
