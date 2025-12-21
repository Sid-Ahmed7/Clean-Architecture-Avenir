import { z } from "zod";

export const transactionHistorySchema = z.object({
  debitAccount: z.number(),
  creditAccount: z.number(),
  amount: z.number().positive(),
  transactionType: z.string(),
  status: z.string(),
  transactionReference: z.string(),
  executedBy: z.string(),
  createdAt: z.string(),
  debitUserName: z.string().optional(),
  creditUserName: z.string().optional(),
});

export const transactionHistoryArraySchema = z.array(transactionHistorySchema);

export type TransactionHistoryModel = z.infer<typeof transactionHistorySchema>;
