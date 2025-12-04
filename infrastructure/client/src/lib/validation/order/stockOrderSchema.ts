import { OrderStatusEnum, OrderTypeEnum } from "@/types/createOrder";
import z from "zod";


export const stockOrderSchema =  (t:(key:string) => string) =>
z.object({
  id: z.number(),
  userId: z.string(),
  stockSymbol: z.string(),
  quantity: z.number(),
  orderPrice: z.number(),
  fee: z.number(),
  orderType: z.enum(OrderTypeEnum),
  orderStatus: z.enum(OrderStatusEnum),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type StockOrder = z.infer<typeof stockOrderSchema>;
