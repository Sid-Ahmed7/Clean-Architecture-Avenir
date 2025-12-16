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
  orderType: z.enum(OrderTypeEnum),
  orderStatus: z.enum(OrderStatusEnum),
  createdAt: z.string(),
  updatedAt: z.string(),
  executedAt: z.string().optional(),
  remainingQuantity: z.number().optional(),
  feesPaid: z.boolean().optional(),
});

export type StockOrder = z.infer<ReturnType<typeof stockOrderSchema>>;
