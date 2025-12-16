import { OrderTypeEnum } from "./createOrder";

export enum OrderStatusEnum {
    PENDING = 'PENDING',
    EXECUTED = 'EXECUTED',
    PARTIALLY_EXECUTED = 'PARTIALLY_EXECUTED',
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
  fee: number;
  status: OrderStatusEnum;
  createdAt: string;
  executedAt?: string;
  executionPrice?: number;
  remainingQuantity?: number;
  feesPaid?: boolean;
}
export interface PlaceOrderPayload {
  stockSymbol: string;
  quantity: number;
  orderPrice: number;
  orderType: OrderTypeEnum;
}