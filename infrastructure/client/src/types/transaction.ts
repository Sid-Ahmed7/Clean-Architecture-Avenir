export enum TransactionType {
  BUY = "BUY",
  SELL = "SELL"
}

export interface Transaction {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  stockSymbol: string;
  quantity: number;
  executionPrice: number;
  buyerUserId: string;
  sellerUserId: string;
  buyerFee: number;
  sellerFee: number;
  executedAt: string;
  type?: TransactionType;
  totalAmount?: number;
  fee?: number;
}

export interface UserTransaction extends Transaction {
  type?: TransactionType;
  totalAmount?: number;
  fee?: number;
}