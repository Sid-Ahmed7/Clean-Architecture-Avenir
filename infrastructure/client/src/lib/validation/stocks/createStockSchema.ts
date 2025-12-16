import { z } from "zod";

export const createStockRequestSchema = (t: (key: string) => string) =>
  z.object({
    symbol: z.string(),
    companyName: z.string(),
    name: z.string(),
    currentPrice: z.number(),
    currency: z.string(),
    isActionAvailable: z.boolean(),
    totalShares: z.number().min(1, "La quantité totale doit être au moins 1"),
  });

export type CreateStock = z.infer<ReturnType<typeof createStockRequestSchema>>;
