import { z } from "zod";

export const createStockRequestSchema = (t: (key: string) => string) =>
  z.object({
    symbol: z.string(),
    companyName: z.string(),
    name: z.string(),
    currentPrice: z.number(),
    previousPrice: z.number().optional(),
    rateOfChange: z.number(),
    currency: z.string(),
    isActionAvailable: z.boolean(),
  });

export type CreateStock = z.infer<ReturnType<typeof createStockRequestSchema>>;
