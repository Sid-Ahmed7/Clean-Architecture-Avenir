import { useQuery } from "@tanstack/react-query";
import * as positionApi from "../lib/api/position";
import z from "zod";
import { useTranslations } from "next-intl";
import { stockPositionSchema } from "@/lib/validation/position/stockPositionSchema";
import { positionDetailsSchema } from "@/lib/validation/position/positionDetailsSchema";

export const POSITIONS_KEY = "positions";

export const useUserPositions = () => {
  const t = useTranslations();

  return useQuery({
    queryKey: [POSITIONS_KEY, "userPositions"],
    queryFn: async () => {
      const data = await positionApi.getUserPositions();
      const parsed = z.array(stockPositionSchema(t)).safeParse(data);

      if (!parsed.success) {
        console.error("Positions data validation failed:", parsed.error);
        return [];
      }

      return parsed.data;
    },
    staleTime: 10 * 1000, 
    enabled: true,
  });
};

export const usePositionBySymbol = (symbol: string) => {
  const t = useTranslations();

  return useQuery({
    queryKey: [POSITIONS_KEY, symbol],
    queryFn: async () => {
      const data = await positionApi.getPositionBySymbol(symbol);
      const parsed = positionDetailsSchema(t).safeParse(data);

      if (!parsed.success) {
        console.error(`Position details validation failed for symbol ${symbol}:`, parsed.error);
        return null;
      }

      return parsed.data;
    },
    enabled: !!symbol, 
    staleTime: 10 * 1000,
  });
};