
export interface PostgresStockHoldingRow {
    id: string;
    user_id: string;
    stock_symbol: string;
    quantity: number;
    block_quantity: number;
    average_purchase_price: number;
    total_invested: number;
    created_at: Date;
    updated_at: Date;
}
