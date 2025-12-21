import { StockTransaction } from "../validation/transaction/stockTransactionSchema";
import { apiClient } from "./apiClient";

export const getUserTransactions = async () => {
  const { data } = await apiClient.get<StockTransaction[]>("/stock/transaction");
  return data;
};

export const getTransactionsBySymbol = async (symbol: string) => {
  const { data } = await apiClient.get<StockTransaction[]>(`/stock/transaction/${symbol}`);
  return data;
};