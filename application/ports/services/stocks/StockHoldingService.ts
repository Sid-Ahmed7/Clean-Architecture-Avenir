import { PositionNotFoundError } from "../../../errors/PositionNotFoundError";

export interface StockHoldingService {
    hasEnoughShares(userId: string, stockSymbol: string, quantity: number): Promise<boolean | PositionNotFoundError>;
    addShares(userId: string, stockSymbol: string, quantity: number, pricePerShare: number): Promise<void | PositionNotFoundError>;
    removeShares(userId: string, stockSymbol: string, quantity: number): Promise<void | PositionNotFoundError>;
}
