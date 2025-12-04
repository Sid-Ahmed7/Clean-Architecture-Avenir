import { ChangeStockAvailability } from "../validation/stocks/changeAvailabilitySchema";
import { CreateStock } from "../validation/stocks/createStockSchema";
import { Stock } from "../validation/stocks/stockSchema";
import { apiClient } from "./apiClient"

export const getAllStocks = async () => {
    const {data} = await apiClient.get<Stock[]>("/stocks");
    return data;
}

export const getAvailableStocks = async () => {
    const {data} = await apiClient.get<Stock[]>("/stocks/available");
    return data;
}

export const getStockBySymbol = async (symbol: string) => {
  const { data } = await apiClient.get<Stock>(`/stock/symbol/${symbol}`);
  return data;
};

export const getStockById = async (id: number) => {
  const { data } = await apiClient.get<Stock>(`/stock/${id}`);
  return data;
};

export const createStock = async (payload: CreateStock) => {
  const { data } = await apiClient.post<Stock>("/stock/create", payload);
  return data;
};

export const updateStock = async (payload: Stock) => {
  const { data } = await apiClient.put<Stock>("/stock/update", payload);
  return data;
};

export const changeStockAvailability = async (payload: Stock) => {
  const { data } = await apiClient.put<Stock>(`/stock/${payload.id}/availability`,{ isActionAvailable: payload.isActionAvailable});
  return data;
}

export const updateStockPrice = async (symbol: string) => {
  await apiClient.post(`/stock/${symbol}/update-price`);
};




