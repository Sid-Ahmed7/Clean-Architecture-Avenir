import { TransactionType } from "@/types/transaction";
import z from "zod";

export const stockTransactionSchema = (t:(key:string) => string) =>
z.object({
  id: z.string(),
  buyOrderId: z.string(),
  sellOrderId: z.string(),
  stockSymbol: z.string(),
  quantity: z.number(),
  executionPrice: z.number(),
  buyerUserId: z.string(),
  sellerUserId: z.string(),
  buyerFee: z.number(),
  sellerFee: z.number(),
  executedAt: z.string(),
});
export type StockTransaction = z.infer<ReturnType<typeof stockTransactionSchema>>;
