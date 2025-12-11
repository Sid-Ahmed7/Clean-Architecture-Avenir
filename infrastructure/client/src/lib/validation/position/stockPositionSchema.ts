import z from "zod";

export const stockPositionSchema = (t:(key:string) => string) =>
 z.object({
  id: z.string(),
  userId: z.string(),
  stockSymbol: z.string(),
  quantity: z.number(),
  averagePurchasePrice: z.number(),
  totalInvested: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type StockPosition = z.infer<ReturnType<typeof stockPositionSchema>>;
