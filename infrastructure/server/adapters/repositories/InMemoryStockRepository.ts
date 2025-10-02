import { StockRepositoryInterface } from "../../../../application/repositories/StockRepositoryInterface";
import { StockEntity } from "../../../../domain/entities/StockEntity";
import { InvalidAccountError } from "../../../../domain/errors/InvalidAccountError";
import { StockAlreadyExistsError } from "../../../../domain/errors/StockAlreadyExistsError";
import { StockNotFoundError } from "../../../../domain/errors/StockNotFoundError";

export class InMemoryStockRepository implements StockRepositoryInterface {

    private stocks: Array<StockEntity>;

    public constructor() {

        const firstStock = StockEntity.from(
            1,
            "AAPL:NASDAQ",
            "Apple",
            "Vente 10%",
            150,
            0,
            "USD",
            new Date(),
            true,
            new Date(),
        );

        const secondStock = StockEntity.from(
            2,
            "AAPL.B:NASDAQ",
            "Apple",
            "Vente 70%",
            68965,
            0,
            "USD",
            new Date(),
            true,
            new Date(),
        );

        if(firstStock instanceof Error || secondStock instanceof Error) {
            throw new Error("Bad initialization of stocks");
        }

        this.stocks = [firstStock, secondStock];
    }


    public async findStockById(id: number): Promise<StockEntity | StockNotFoundError> {
        const stock = this.stocks.find((stock) => stock.id === id);

        if(!stock) {
            return new StockNotFoundError("Stock not found");
        }

        return stock;
    }

        public async findStockBySymbol(symbol: string): Promise<StockEntity | StockNotFoundError> {
        const stock = this.stocks.find((stock) => stock.symbol === symbol);

        if(!stock) {
            return new StockNotFoundError("Stock not found");
        }

        return stock;
    }

    public async getAllStocks(): Promise<Array<StockEntity>> {
        return this.stocks;
    }

    public async createStock(stock: StockEntity): Promise<StockEntity | StockAlreadyExistsError> {
        const actualStock = this.stocks.find((stk) => stk.symbol === stock.symbol)
        
        if(actualStock) {
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