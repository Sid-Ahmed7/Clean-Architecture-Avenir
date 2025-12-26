
export interface PostgresStockTransactionRow {
    id: string;
    buy_order_id: string;
    sell_order_id: string;
    stock_symbol: string;
    quantity: string;
    execution_price: string;
    buyer_user_id: string;
    seller_user_id: string;
    buyer_fee: string;
    seller_fee: string;
    executed_at: Date;
}
