import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as orderApi from "../lib/api/order";
import z from "zod";
import { stockOrderSchema } from "@/lib/validation/order/stockOrderSchema";
import { useTranslations } from "next-intl";
import { CreateStock } from "@/types/createStock";
import { createStockRequestSchema } from "@/lib/validation/stocks/createStockSchema";
import { PlaceOrder, placeOrderSchema } from "@/lib/validation/order/placeOrderSchema";
import { matchOrdersSchema } from "@/lib/validation/order/matchOrdersSchema";

export const ORDER_KEY = "orders";
export const USER_ORDERS_KEY = "userOrders";
export const ALL_ORDERS_KEY = "allOrders";

export const useOrderBook = () => {
    const t = useTranslations();

  return useQuery({
    queryKey: [ORDER_KEY],
    queryFn: async () => {
      const data = await orderApi.getUserOrders();
      const parsed = z.array(stockOrderSchema(t)).safeParse(data);
      if (!parsed.success) {
        console.error("Orders data validation failed:", parsed.error);
        return [];
      }
      return parsed.data.map(order => ({
        ...order,
        status: order.orderStatus
      }));
    },
    enabled: true,
    staleTime: 10 * 1000,
  });
};

export const useAllOrders = () => {
    const t = useTranslations();

  return useQuery({
    queryKey: [ALL_ORDERS_KEY],
    queryFn: async () => {
      const data = await orderApi.getAllOrders();
      const parsed = z.array(stockOrderSchema(t)).safeParse(data);
      if (!parsed.success) {
        console.error("All orders data validation failed:", parsed.error);
        return [];
      }
      return parsed.data.map(order => ({
        ...order,
        status: order.orderStatus
      }));
    },
    enabled: true,
    staleTime: 10 * 1000,
  });
};

export const usePlaceOrder = () => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PlaceOrder) => {
      const parsed = placeOrderSchema(t).safeParse(payload);
      if (!parsed.success) {
        throw new Error("Invalid CreateStock payload");
      }

      return orderApi.placeOrder(parsed.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_KEY] });
    },
  });
}
export const useMatchOrders = () => {
    const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (symbol: string) => {
        const parsed = matchOrdersSchema(t).safeParse({ symbol });
        if (!parsed.success) {
          throw new Error("Invalid symbol payload");
        }
      return orderApi.matchOrders(parsed.data.symbol);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_KEY] });
      queryClient.invalidateQueries({ queryKey: [ALL_ORDERS_KEY] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    }
  });

};
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderApi.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_KEY] });
      queryClient.invalidateQueries({ queryKey: [USER_ORDERS_KEY] });
    },
    onError: (error) => {
      console.error('[useCancelOrder] Error:', error);
    },
  });
};