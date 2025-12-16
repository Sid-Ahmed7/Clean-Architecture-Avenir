export interface Position {
  id: string;
  userId: string;
  stockSymbol: string;
  quantity: number;
  averagePurchasePrice: number;
  totalInvested: number;
  createdAt: string;
  updatedAt: string;
  blockQuantity?: number;
}

export interface PositionWithDetails extends Position {
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  stockName?: string;
  availableQuantity?: number;
}