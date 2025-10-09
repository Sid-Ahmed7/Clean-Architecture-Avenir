import { StockEntity } from "../../../domain/entities/StockEntity";
import { StockRepositoryInterface } from "../../ports/repositories/StockRepositoryInterface";

export class GetStockByIdUseCase {

    public constructor(private stockRepository: StockRepositoryInterface) {}

    public async execute(id: number) : Promise<StockEntity | Error> {

        const stock = await this.stockRepository.findStockById(id);

        if(stock instanceof Error) {
            return stock;
        }

        return stock;
    }

}