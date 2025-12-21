export interface OrderBookEntry {
    id: string;
    price: number;
    quantity: number;
    createdAt: Date;
}

export interface OrderBookResponse {
    symbol: string;
    buyOrders: OrderBookEntry[];
    sellOrders: OrderBookEntry[];
}
