import { OrderTypeEnum } from "@/types/createOrder";
import { z } from "zod";

export const placeOrderSchema = (t: (key: string) => string) =>
  z.object({
    stockSymbol: z.string(),
    quantity: z.number(),
    orderPrice: z.number(),
    orderType: z.nativeEnum(OrderTypeEnum)
  });

export type PlaceOrder = z.infer<ReturnType<typeof placeOrderSchema>>;
