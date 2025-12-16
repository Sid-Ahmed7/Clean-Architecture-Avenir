import { z } from "zod";

export const stockSchema = (t: (key: string) => string) =>
  z.object({
    id: z.string(),
    symbol: z.string(),
    companyName: z.string(),
    name: z.string(),
    currentPrice: z.number(),
    previousPrice: z.number().optional(),
    currency: z.string(),
    rateOfChange: z.number(),
    isActionAvailable: z.boolean(),
    totalShares: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    ipoActive: z.boolean(),
    availableSharesForIPO: z.number(),
  });

export type Stock = z.infer<ReturnType<typeof stockSchema>>;
