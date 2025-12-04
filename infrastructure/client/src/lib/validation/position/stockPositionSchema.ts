import z from "zod";

export const stockPositionSchema = (t:(key:string) => string) =>
 z.object({
  id: z.number(),
  userId: z.string(),
  stockSymbol: z.string(),
  quantity: z.number(),
  averagePrice: z.number(),
  totalInvested: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type StockPosition = z.infer<typeof stockPositionSchema>;
