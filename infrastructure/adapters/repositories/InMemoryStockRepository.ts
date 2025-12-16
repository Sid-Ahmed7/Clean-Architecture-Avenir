import { StockRepositoryInterface } from "../../../application/ports/repositories/stocks/StockRepositoryInterface";
import { StockEntity } from "../../../domain/entities/StockEntity";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { StockAlreadyExistsError } from "../../../application/errors/StockAlreadyExistsError";
import { StockNotFoundError } from "../../../application/errors/StockNotFoundError";

export class InMemoryStockRepository implements StockRepositoryInterface {

    private stocks: Array<StockEntity>;



    public constructor() {
        this.stocks = [];

    }

    public async findStockById(id: string): Promise<StockEntity | StockNotFoundError> {
        const stock = this.stocks.find((stock) => stock.id === id);

        if(!stock) {
            return new StockNotFoundError("Stock not found");
        }

        return stock;
    }

public async findStockBySymbol(symbol: string): Promise<StockEntity | StockNotFoundError> {
    const normalizedSymbol = symbol.toUpperCase();
    const stock = this.stocks.find(s => s.symbol.toUpperCase() === normalizedSymbol);

    if (!stock) return new StockNotFoundError("Stock not found");
    return stock;
}


    public async getAllStocks(): Promise<Array<StockEntity>> {
        return this.stocks;
    }

    public async getAvailableStocks(): Promise<Array<StockEntity>> {
        return this.stocks.filter((stock => stock.isActionAvailable));
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
            const index = this.stocks.findIndex((stk) => stk.id === stock.id);

            if (index === -1) {
                return new StockNotFoundError("Stock not found");
            }

            stock.updatedAt = new Date();

            this.stocks[index] = stock;

            return this.stocks[index];
        }



        public async deleteStock(id: string): Promise<void | StockNotFoundError> {
            const index = this.stocks.findIndex((stk) => stk.id === id);

            if (index === -1) {
                return new StockNotFoundError("Stock not found");
            }       
            this.stocks.splice(index, 1);  
        }
}