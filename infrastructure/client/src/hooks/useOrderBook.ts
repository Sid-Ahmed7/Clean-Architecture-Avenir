import { useQuery } from "@tanstack/react-query";
import * as orderBookApi from "../lib/api/orderBook";

export const useOrderBook = (symbol: string) => {
  return useQuery({
    queryKey: ["orderBook", symbol],
    queryFn: () => orderBookApi.getOrderBook(symbol),
    enabled: !!symbol,
    staleTime: 5 * 1000, 
    refetchInterval: 5 * 1000, 
  });
};
