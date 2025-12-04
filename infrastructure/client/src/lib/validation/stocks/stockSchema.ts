import { z } from "zod";

export const stockSchema = (t: (key: string) => string) =>
  z.object({
    id: z.number().refine(val => val >= 0, { message: t("stock.id.invalid") }),
    symbol: z
      .string()
      .min(1, { message: t("stock.symbol.required") })
      .max(10, { message: t("stock.symbol.max") })
      .transform(s => s.toUpperCase()),
    companyName: z.string().min(1, { message: t("stock.companyName.required") }),
    currentPrice: z.number().positive({ message: t("stock.currentPrice.positive") }),
    previousPrice: z.number().positive({ message: t("stock.previousPrice.positive") }),
    rateOfChange: z.number(),
    isActionAvailable: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  });

export type Stock = z.infer<ReturnType<typeof stockSchema>>;
