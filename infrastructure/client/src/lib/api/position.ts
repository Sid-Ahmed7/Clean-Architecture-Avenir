import { PositionDetails } from "../validation/position/positionDetailsSchema";
import { StockPosition } from "../validation/position/stockPositionSchema";
import { apiClient } from "./apiClient";

export const getUserPositions = async () => {
  const { data } = await apiClient.get<StockPosition[]>("/stock/position");
  return data;
};

export const getPositionBySymbol = async (symbol: string) => {
  const { data } = await apiClient.get<PositionDetails>(`/stock/position/${symbol}`);
  return data;
};
