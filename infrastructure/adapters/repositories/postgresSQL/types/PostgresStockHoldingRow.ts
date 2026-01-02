
export interface PostgresStockHoldingRow {
    id: string;
    user_id: string;
    stock_symbol: string;
    quantity: string;
    block_quantity: string;
    average_purchase_price: string;
    total_invested: string;
    created_at: Date;
    updated_at: Date;
}
