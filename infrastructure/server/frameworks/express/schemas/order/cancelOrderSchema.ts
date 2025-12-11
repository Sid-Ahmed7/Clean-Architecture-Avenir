import z from "zod";
import { OrderTypeEnum } from "../../../../../../domain/enums/OrderTypeEnum";

export const placeOrderSchema = z.object({
  stockSymbol: z.string(),
  quantity: z.number(),
  orderPrice: z.number(),
  orderType: z.enum(OrderTypeEnum),
  fee: z.number(),
});

export type PlaceOrder = z.infer<typeof placeOrderSchema>;
