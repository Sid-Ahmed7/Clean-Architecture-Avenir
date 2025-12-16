import { PlaceOrder } from "../validation/order/placeOrderSchema";
import { StockOrder } from "../validation/order/stockOrderSchema";
import { apiClient } from "./apiClient";

export const placeOrder = async (orderData: PlaceOrder) => {
  const { data } = await apiClient.post<StockOrder>("/stock/order/create", orderData);
  return data;
};

export const getUserOrders = async () => {
  const { data } = await apiClient.get<StockOrder[]>("/stock/order");
  return data;
};

export const getAllOrders = async () => {
  const { data } = await apiClient.get<StockOrder[]>("/stock/order/all");
  return data;
};

export const matchOrders = async (symbol: string) => {
  const { data } = await apiClient.post(`/stock/order/match/${symbol}`);
  return data;
};
export const cancelOrder = async (orderId: string) => {
  const { data } = await apiClient.patch(`/stock/order/${orderId}/cancel`);
  return data;
};