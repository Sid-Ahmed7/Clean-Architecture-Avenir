import { z } from "zod";

export const placeOrderSchema = (t: (key: string) => string) =>
  z.object({
    stockSymbol: z.string()
      .min(1, { message: t("order.stockSymbol.required") })
      .max(10, { message: t("order.stockSymbol.max") })
      .transform(s => s.toUpperCase()),
    quantity: z.number().int().positive({ message: t("order.quantity.positive") }),
    orderPrice: z.number().positive({ message: t("order.orderPrice.positive") }),
    orderType: z.enum(["BUY", "SELL"], { message: t("order.orderType.invalid") }),
  });

export type PlaceOrder = z.infer<ReturnType<typeof placeOrderSchema>>;
