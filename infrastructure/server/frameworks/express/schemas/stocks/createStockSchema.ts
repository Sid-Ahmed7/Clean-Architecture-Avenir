import { z } from "zod";

export const createStockSchema = z.object({
  symbol: z.string(),
  companyName: z.string(),
  name: z.string(),
  currentPrice: z.number(),
  rateOfChange: z.number(),
  currency: z.string(),
  isActionAvailable: z.boolean(),
  previousPrice: z.number(),
});


