import { StockRepositoryInterface } from "../../../application/ports/repositories/StockRepositoryInterface";
import { StockEntity } from "../../../domain/entities/StockEntity";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { StockAlreadyExistsError } from "../../../domain/errors/StockAlreadyExistsError";
import { StockNotFoundError } from "../../../domain/errors/StockNotFoundError";

export class InMemoryStockRepository implements StockRepositoryInterface {

    private stocks: Array<StockEntity>;

    public constructor() {
        this.stocks = [];
    }

    public async findStockById(id: number): Promise<StockEntity | StockNotFoundError> {
        const stock = this.stocks.find((stock) => stock.id === id);

        if(!stock) {
            return new StockNotFoundError("Stock not found");
        }

        return stock;
    }

public async findStockBySymbol(symbol: string): Promise<StockEntity | StockNotFoundError> {
    const [symbolPart, marketPart] = symbol.split(":");
    const stock = this.stocks.find(s => {
        const [sPart, mPart] = s.symbol.split(":");
        return sPart?.toUpperCase() === symbolPart?.toUpperCase() &&
            mPart?.toUpperCase() === (marketPart?.toUpperCase() ?? "");
    });

    if (!stock) return new StockNotFoundError("Stock not found");
    return stock;
}


    public async getAllStocks(): Promise<Array<StockEntity>> {
        return this.stocks;
    }

    public async createStock(stock: StockEntity): Promise<StockEntity | StockAlreadyExistsError> {
        const existingStock = await this.findStockBySymbol(stock.symbol);
        
        if(!(existingStock instanceof StockNotFoundError)) {
            return new StockAlreadyExistsError("Stock already exist");
        }

        this.stocks.push(stock);
        return stock;
    }

        public async updateStock(stock: StockEntity): Promise<StockEntity | StockNotFoundError> {
            const actualStock = this.stocks.find((stk) => stk.id === stock.id);

            if (!actualStock) {
                return new StockNotFoundError("Stock not found");
            }

            actualStock.isActionAvailable = stock.isActionAvailable;
            actualStock.updatedAt = new Date();

            return actualStock;
        }



        public async deleteStock(id: number): Promise<void | StockNotFoundError> {
            const index = this.stocks.findIndex((stk) => stk.id === id);

            if (index === -1) {
                return new StockNotFoundError("Stock not found");
            }       
            this.stocks.splice(index, 1);  
        }
}