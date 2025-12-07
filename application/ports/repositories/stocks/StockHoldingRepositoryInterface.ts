import { StockHoldingEntity } from "../../../../domain/entities/StockHoldingEntity";
import { PositionAlreadyExistsError } from "../../../errors/PositionAlreadyExistsError";
import { PositionNotFoundError } from "../../../errors/PositionNotFoundError";

export interface StockHoldingRepositoryInterface {

    createPosition(position: StockHoldingEntity): Promise<StockHoldingEntity | PositionAlreadyExistsError>;
    updatePosition(position: StockHoldingEntity): Promise<StockHoldingEntity | PositionNotFoundError>;
    deletePosition(id: string): Promise<void | PositionNotFoundError>;
    findPositionById(id: string): Promise<StockHoldingEntity | PositionNotFoundError>;
    findPositionsByUserId(userId: string): Promise<Array<StockHoldingEntity>>;
    findPositionByUserIdAndSymbol(userId: string, symbol: string): Promise<StockHoldingEntity | PositionNotFoundError>;
    findNonEmptyPositions(userId: string):Promise<Array<StockHoldingEntity>>;
    findPositionsBySymbol(symbol: string): Promise<Array<StockHoldingEntity>>;
}