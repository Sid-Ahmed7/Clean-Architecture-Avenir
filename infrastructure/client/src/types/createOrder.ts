export enum OrderTypeEnum {
  BUY = "BUY",
  SELL = "SELL",
}

export enum OrderStatusEnum {
  PENDING = "PENDING",
  EXECUTED = "EXECUTED",
  PARTIALLY_EXECUTED = "PARTIALLY_EXECUTED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

export interface CreateOrderRequest {
  stockSymbol: string;
  quantity: number;
  orderPrice: number;
  orderType: OrderTypeEnum;
}
