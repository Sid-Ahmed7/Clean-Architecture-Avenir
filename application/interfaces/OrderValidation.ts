import { OrderTypeEnum } from "../../domain/enums/OrderTypeEnum";

export interface OrderValidation {
    userId: string;
    orderType: OrderTypeEnum;
    quantity: number;
    orderPrice: number,
    stockSymbol: string;
}