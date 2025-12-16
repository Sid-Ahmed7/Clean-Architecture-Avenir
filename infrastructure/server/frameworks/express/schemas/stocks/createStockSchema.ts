import { z } from "zod";

export const createStockSchema = z.object({
  symbol: z.string(),
  companyName: z.string(),
  name: z.string(),
  currentPrice: z.number(),
  currency: z.string(),
  isActionAvailable: z.boolean(),
  totalShares: z.number().min(1, "Total shares must be at least 1"),
});


