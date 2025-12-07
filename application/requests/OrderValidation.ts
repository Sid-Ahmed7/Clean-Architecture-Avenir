import { OrderTypeEnum } from "../../domain/enums/OrderTypeEnum";

export interface OrderValidation {
    orderType: OrderTypeEnum;
    quantity: number;
    orderPrice: number,
    stockSymbol: string;
}