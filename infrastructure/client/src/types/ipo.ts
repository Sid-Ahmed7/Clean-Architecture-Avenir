import { Stock } from "./stock";

export interface PurchaseIPOSharesRequest {
  stockSymbol: string;
  quantity: number;
}

export interface PurchaseIPOSharesResponse {
  message: string;
  position: {
    id: string;
    userId: string;
    stockSymbol: string;
    quantity: number;
    averagePurchasePrice: number;
    availableQuantity: number;
    blockedQuantity: number;
  };
}

export interface CloseIPOResponse {
  message: string;
  stock: Stock;
}

export interface OpenIPOResponse {
  message: string;
  stock: Stock;
}

