export interface OrderBookEntry {
  id: string;
  price: number;
  quantity: number;
  createdAt: string;
}

export interface OrderBook {
  symbol: string;
  buyOrders: OrderBookEntry[];
  sellOrders: OrderBookEntry[];
}