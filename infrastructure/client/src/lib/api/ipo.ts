import { apiClient } from "./apiClient";
import { CloseIPOResponse, OpenIPOResponse, PurchaseIPOSharesRequest, PurchaseIPOSharesResponse } from "@/types/ipo";


export const purchaseIPOShares = async (data: PurchaseIPOSharesRequest) => {
  const { data: response } = await apiClient.post<PurchaseIPOSharesResponse>(
    "/stock/ipo/purchase",
    data
  );
  return response;
};


export const closeIPO = async (symbol: string) => {
  const { data: response } = await apiClient.post<CloseIPOResponse>(
    `/stock/${symbol}/ipo/close`
  );
  return response;
};

export const openIPO = async (symbol: string, sharesToMakeAvailable?: number) => {
  const { data: response } = await apiClient.post<OpenIPOResponse>(
    `/stock/${symbol}/ipo/open`,
    sharesToMakeAvailable ? { sharesToMakeAvailable } : {}
  );
  return response;
};