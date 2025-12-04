import { z } from "zod";

export const matchOrdersSchema = (t: (key: string) => string) =>
  z.object({
    symbol: z.string()
      .min(1, { message: t("order.symbol.required") })
      .max(10, { message: t("order.symbol.max") })
      .transform(s => s.toUpperCase()),
  });

export type MatchOrders = z.infer<ReturnType<typeof matchOrdersSchema>>;
