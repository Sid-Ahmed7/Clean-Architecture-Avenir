import { OrderStatusEnum, OrderTypeEnum } from "@/types/createOrder";
import z from "zod";


export const stockOrderSchema =  (t:(key:string) => string) =>
z.object({
  id: z.string(),
  userId: z.string(),
  stockSymbol: z.string(),
  quantity: z.number(),
  orderPrice: z.number(),
  fee: z.number(),
  orderType: z.nativeEnum(OrderTypeEnum),
  orderStatus: z.nativeEnum(OrderStatusEnum),
  createdAt: z.string(),
  updatedAt: z.string(),
  executedAt: z.string().optional(),
  remainingQuantity: z.number().optional(),
});

export type StockOrder = z.infer<ReturnType<typeof stockOrderSchema>>;
