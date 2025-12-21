import z from "zod";

export const requestOverdraftIncreaseSchema = z.object({
    overdraftLimit: z.number().nonnegative(),
});

