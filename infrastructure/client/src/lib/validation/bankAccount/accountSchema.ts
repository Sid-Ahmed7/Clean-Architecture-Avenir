import z from "zod";

export const accountSchema = (t:(key: string) => string) =>

z.object({
      accountNumber: z.number().int().refine(num => num.toString().length === 11, {
      message: "Le numéro de compte doit comporter exactement 11 chiffres",
    }),
    iban: z.string().length(27),
    userId: z.string(),
    accountType: z.enum(["CHECKING", "SAVINGS"]),
    currentBalance: z.number(),
    currency: z.string().length(3),
    accountStatus: z.enum(["ACTIVE","CLOSED", "SUSPENDED", "PENDING", "FROZEN", "BANNED"]),
    isActive: z.boolean(),
    withdrawalLimit: z.number(),
    transferLimit: z.number(),
    overdraftLimit: z.number(),
    createdAt: z.string(),
    customAccountName: z.string().optional(),
    totalTransfered: z.number().min(0).default(0),
    lastTransferResetDate: z.string().optional(),
    parentAccountId: z.number().optional(),
    closedAt: z.string().optional(),
    blockedBalanced: z.number().optional().default(0)

});

export type AccountModel = z.infer<ReturnType<typeof accountSchema>>;
