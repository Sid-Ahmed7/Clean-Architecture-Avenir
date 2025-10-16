import { z } from "zod";

export const createSubAccountSchema = (t: (key: string) => string) =>
    z.object({
        accountType: z.enum(["SAVINGS"]),
        currency: z.enum(["EUR", "USD"]),
        customAccountName: z.string().min(1, "Le nom du compte est requis"),
        parentAccountId: z.number().optional(),
    });

export type CreateSubAccountModel = z.infer<ReturnType<typeof createSubAccountSchema>>;