export interface PositionWithDetails {
    id: string;
    userId: string;
    stockSymbol: string;
    quantity: number;
    averagePurchasePrice: number;
    totalInvested: number;
    createdAt: Date;
    updatedAt: Date;
    blockQuantity?: number;
    currentPrice: number;
    currentValue: number;
    profitLoss: number;
    profitLossPercent: number;
    stockName?: string;
}