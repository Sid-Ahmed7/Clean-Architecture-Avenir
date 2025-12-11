import { OrderTypeEnum } from "./createOrder";

export enum OrderStatus {
    PENDING = 'PENDING',
    EXECUTED = 'EXECUTED',
    PARTIALLY_EXECUTED ='PARTIALLY_EXECUTED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED',
}

export enum OrderType {
    BUY = 'BUY',
    SELL = 'SELL',
}
export interface Order {
  id: string;
  userId: string;
  stockSymbol: string;
  orderType: "BUY" | "SELL";
  quantity: number;
  orderPrice: number;
  status: OrderStatus;
  createdAt: string;
  executedAt?: string;
  executionPrice?: number;
}
export interface PlaceOrderPayload {
  stockSymbol: string;
  quantity: number;
  orderPrice: number;
  orderType: OrderTypeEnum;
}