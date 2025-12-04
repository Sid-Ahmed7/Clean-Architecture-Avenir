import { z } from "zod";

export const createStockRequestSchema = (t: (key: string) => string) =>
  z.object({
    symbol: z.string().min(1, { message: t("stock.symbol.required") }).max(10, { message: t("stock.symbol.max") }).transform(s => s.toUpperCase()),
    companyName: z.string().min(1, { message: t("stock.companyName.required") }),
    currentPrice: z.number().positive({ message: t("stock.currentPrice.positive") }),
    previousPrice: z.number().positive({ message: t("stock.previousPrice.positive") }),
    rateOfChange: z.number(),
    isActionAvailable: z.boolean(),
  });

export type CreateStock = z.infer<ReturnType<typeof createStockRequestSchema>>;
