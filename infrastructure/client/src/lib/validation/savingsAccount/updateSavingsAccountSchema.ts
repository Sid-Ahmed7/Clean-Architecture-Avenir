import { z } from "zod";

export const updateSavingsAccountSchema = z.object({
    accountNumber: z.number().int().positive({
        message: "Account number must be a positive integer"
    }),
    interestRate: z.number().min(0, {
        message: "Interest rate must be at least 0"
    }).max(100, {
        message: "Interest rate cannot exceed 100"
    }).optional(),
    maxDepositAmount: z.number().positive({
        message: "Max deposit amount must be positive"
    }).max(10000000, {
        message: "Max deposit amount cannot exceed 10,000,000"
    }).nullable().optional(),
    isActive: z.boolean().optional()
});

export type UpdateSavingsAccountInput = z.infer<typeof updateSavingsAccountSchema>;
