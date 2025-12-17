
export interface PostgresStockTransactionRow {
    id: string;
    buy_order_id: string;
    sell_order_id: string;
    stock_symbol: string;
    quantity: number;
    execution_price: number;
    buyer_user_id: string;
    seller_user_id: string;
    buyer_fee: number;
    seller_fee: number;
    executed_at: Date;
}
