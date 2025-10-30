import { z } from "zod";

export const responseSubAccountSchema = (t: (key: string) => string) =>
    z.object({
        accountNumber: z.number().int()
        .refine(num => num.toString().length === 11, {
             message: "Le numéro de compte doit comporter exactement 11 chiffres",
        }),
        iban: z.string().length(27),
        userId: z.string(),
        accountType: z.enum(["SAVINGS"]),
        currentBalance: z.number(),
        currency: z.enum(["EUR", "USD"]),
        accountStatus: z.enum(["ACTIVE","CLOSED", "SUSPENDED", "PENDING", "FROZEN", "BANNED"]),
        customAccountName: z.string().min(1, "Le nom du compte est requis"),
        isActive: z.boolean(),
        withdrawalLimit: z.number(),
        transferLimit: z.number(),
        overdraftLimit: z.number(),
        createdAt: z.string(),
        parentAccountId: z.number(),
        closedAt: z.string().optional()
    });

export type ResponseSubAccountModel = z.infer<ReturnType<typeof responseSubAccountSchema>>;