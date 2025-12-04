export enum OrderTypeEnum {
  BUY = "BUY",
  SELL = "SELL",
}

export enum OrderStatusEnum {
  PENDING = "PENDING",
  EXECUTED = "EXECUTED",
  CANCELLED = "CANCELLED",
}

export interface CreateOrderRequest {
  stockSymbol: string;
  quantity: number;
  orderPrice: number;
  orderType: OrderTypeEnum;
}
