import { StockHoldingEntity } from "../../domain/entities/StockHoldingEntity";

export interface PositionDetails {
    position: StockHoldingEntity;
    currentPrice: number;
    currentValue: number;
    profitLoss: number;
    profitLossPercent: number;
}