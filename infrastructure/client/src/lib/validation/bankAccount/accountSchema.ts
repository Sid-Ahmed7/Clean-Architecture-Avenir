import z from "zod";
import {AccountTypeEnum} from "../../../../../../domain/enums/AccountTypeEnum";
import {AccountStatusEnum} from "../../../../../../domain/enums/AccountStatusEnum";


export const accountSchema = (t:(key: string) => string) =>

z.object({
      accountNumber: z
    .number()
    .int()
    .refine(num => num.toString().length === 11, {
      message: "Le numéro de compte doit comporter exactement 11 chiffres",
    }),
    iban: z.string().length(34),
    userId: z.string(),
    accountType: z.enum(AccountTypeEnum),
    currentBalance: z.number(),
    currency: z.string().length(3),
    accountStatus: z.enum(AccountStatusEnum),
    isActive: z.boolean(),
    withdrawaLimit: z.number(),
    transferLimit: z.number(),
    overdraftLimit: z.number(),
    createdAt: z.string(),
    customAccountName: z.string(),
    parentAccountId: z.number().optional(),
    closedAt: z.string().optional()

});

export type AccountModel = z.infer<ReturnType<typeof accountSchema>>;
