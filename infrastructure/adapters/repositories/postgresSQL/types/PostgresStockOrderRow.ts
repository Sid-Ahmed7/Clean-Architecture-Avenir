import { OrderTypeEnum, OrderStatusEnum } from "./PostgresEnums";


export interface PostgresStockOrderRow {
    id: string;
    user_id: string;
    stock_symbol: string;
    quantity: number;
    order_price: number;
    fee: number;
    order_type: OrderTypeEnum;
    order_status: OrderStatusEnum;
    created_at: Date;
    updated_at: Date;
    executed_at: Date | null;
    remaining_quantity: number;
    fees_paid: boolean;
}
