import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as stocksApi from "../lib/api/stocks";
import z, { symbol } from "zod";
import { stockSchema } from "@/lib/validation/stocks/stockSchema";
import { createStockRequestSchema } from "@/lib/validation/stocks/createStockSchema";
import { CreateStock } from "@/types/createStock";
import { ChangeStockAvailability, changeStockAvailabilitySchema } from "@/lib/validation/stocks/changeAvailabilitySchema";
import { Stock } from "@/types/stock";
import { ChangeStockAvailabilityPayload } from "@/types/changeStockAvailability";
import { UpdateStock, updateStockSchema } from "@/lib/validation/stocks/updateStockSchema";
export const STOCKS_KEY = "stocks";

export const useStocks = () => {
    const t = useTranslations();

    return useQuery({
        queryKey: [STOCKS_KEY],
        queryFn: async () => {
            const result = await stocksApi.getAllStocks();
            const parsed = z.array(stockSchema(t)).safeParse(result);
            if(!parsed.success) {
                return [];
            }
            return parsed.data;
        },
        staleTime: 60 * 1000,
    });
};

export const useStockBySymbol =(symbol: string) => {
    const t = useTranslations();

    return useQuery({
        queryKey: [STOCKS_KEY, symbol],
        queryFn: async () => {
            const result = await stocksApi.getStockBySymbol(symbol);
            const parsed = stockSchema(t).safeParse(result);
            if(!parsed.success) {
                return null;
            }
            return parsed.data;
        },
        enabled: !!symbol,
        staleTime: 60 * 1000,
    });
};
export const useCreateStock = () => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStock) => {
      const parsed = createStockRequestSchema(t).safeParse(payload);
      if (!parsed.success) {
        throw new Error("Invalid CreateStock payload");
      }
      return stocksApi.createStock(parsed.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STOCKS_KEY] });
    },
  });
};
export const useUpdateStock = () => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateStock) => {
      const parsed = updateStockSchema(t).safeParse(data);
      if (!parsed.success) {
        console.error("Validation errors:", parsed.error);
        throw new Error("Invalid update payload");
      }

      return stocksApi.updateStock(parsed.data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STOCKS_KEY] });
    },
  });
};
export const useToggleStockAvailability = () => {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ChangeStockAvailabilityPayload }) => {
      const parsed = changeStockAvailabilitySchema(t).safeParse(data);
      if (!parsed.success) throw new Error("Invalid availability payload");

      return stocksApi.changeStockAvailability(id, { isActionAvailable: parsed.data.isActionAvailable });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [STOCKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCKS_KEY, variables.id] });
    },
  });
};
export const useUpdateStockPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ symbol}: { symbol: string;}) => {
      return stocksApi.updateStockPrice(symbol);
    },
    onSuccess: (_, { symbol }) => {
      queryClient.invalidateQueries({ queryKey: [STOCKS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCKS_KEY, symbol] });
    },
  });
};

export const useDeleteStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return stocksApi.deleteStock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STOCKS_KEY] });
    },
  });
};




