import { useQuery } from "@tanstack/react-query";
import { Stock as MarketStock } from "@/types/stock";

export const MARKET_DATA_KEY = "marketData";

export interface MarketDataResponse {
  stocks: MarketStock[];
  total: number;
  cached: boolean;
  cachedAt: string;
  cacheAgeMinutes?: number;
  stale?: boolean;
}

export const useMarketData = () => {
  return useQuery<MarketDataResponse>({
    queryKey: [MARKET_DATA_KEY],
    queryFn: async () => {
      const response = await fetch('/api/stocks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      
      return response.json();
    },
    staleTime: 30 * 1000,      
    refetchInterval: 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};


export const useMarketStockData = (symbol: string) => {
  const { data: marketData, isLoading, error } = useMarketData();
  
  const stockMarketData = marketData?.stocks?.find(
    (stock) => stock.symbol === symbol
  );

  return {
    data: stockMarketData,
    isLoading,
    error,
    isCached: marketData?.cached,
    isStale: marketData?.stale,
    cacheAge: marketData?.cacheAgeMinutes,
  };
};