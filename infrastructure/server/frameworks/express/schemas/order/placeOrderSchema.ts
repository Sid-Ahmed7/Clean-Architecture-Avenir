import { z } from "zod";
import { OrderTypeEnum } from "../../../../../../domain/enums/OrderTypeEnum";

export const placeOrderSchema = z.object({
    orderType: z.enum(OrderTypeEnum),
    quantity: z.number(),
    orderPrice: z.number(),
    stockSymbol: z.string()
});


