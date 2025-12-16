import { OrderBook } from "@/types/orderBook";
import { apiClient } from "./apiClient";



export const getOrderBook = async (symbol: string): Promise<OrderBook> => {
  const { data } = await apiClient.get<OrderBook>(`/stock/order/book/${symbol}`);
  return data;
};
