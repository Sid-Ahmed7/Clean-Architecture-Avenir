import { PositionAlreadyExistsError } from "../../../application/errors/PositionAlreadyExistsError";
import { PositionNotFoundError } from "../../../application/errors/PositionNotFoundError";
import { StockHoldingRepositoryInterface } from "../../../application/ports/repositories/stocks/StockHoldingRepositoryInterface";
import { StockHoldingEntity } from "../../../domain/entities/StockHoldingEntity";

export class InMemoryStockHoldingRepository implements StockHoldingRepositoryInterface {

    private positions: Array<StockHoldingEntity>;

    public constructor() {
        this.positions = [];
    }

    public async findPositionById(id: string): Promise<StockHoldingEntity | PositionNotFoundError> {
        const position = this.positions.find((p) => p.id === id);
        if(!position) {
            return new PositionNotFoundError(`Position with ID ${id} not found`);
        }
        return position;
    }
    
    public async findPositionsByUserId(userId: string): Promise<Array<StockHoldingEntity>> {
        return this.positions.filter(p => p.userId === userId);

    }

    public async findPositionsBySymbol(symbol: string): Promise<Array<StockHoldingEntity>> {
        return this.positions.filter(p => p.stockSymbol === symbol);

    }

    public async findPositionByUserIdAndSymbol(userId: string, symbol: string): Promise<StockHoldingEntity | PositionNotFoundError> {
        const position = this.positions.find(o => o.userId === userId && o.stockSymbol === symbol);
        if(!position) {
            return new PositionNotFoundError(`Position not found`);
        }
        return position;
    }

    public async findNonEmptyPositions(userId: string): Promise<Array<StockHoldingEntity>> {
        return this.positions.filter(p => p.userId === userId && p.quantity > 0);

    }

    public async createPosition(position: StockHoldingEntity): Promise<StockHoldingEntity | PositionAlreadyExistsError> {
        const existingPosition = this.positions.find(p => p.userId === position.userId && p.stockSymbol === position.stockSymbol);
        if(existingPosition) {
           return new PositionAlreadyExistsError(`Position already exist`);
        }
        this.positions.push(position);

        return position;
    }

    public async updatePosition(position: StockHoldingEntity): Promise<StockHoldingEntity | PositionNotFoundError> {
        const index = this.positions.findIndex(p => p.id === position.id);
        if (index === -1){
            return new PositionNotFoundError(`Position with ID ${position.id} not found`);
        }

        this.positions[index] = position;
        return position;
    }

    public async deletePosition(id: string): Promise<void | PositionNotFoundError> {
        const index = this.positions.findIndex(o => o.id === id);
        if (index === -1){
            return new PositionNotFoundError(`Position with ID ${id} not found`);
        }
        this.positions.splice(index, 1)[0];
    }
}