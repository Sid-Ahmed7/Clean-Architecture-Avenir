import { StockOrderEntity } from "../../../domain/entities/StockOrderEntity";
import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";

export class GetUserOrdersUseCase {
    public constructor(private stockOrderRepository: StockOrderRepositoryInterface){}

    public async execute(userId: string): Promise<StockOrderEntity[] | Error> {
        const orders = await this.stockOrderRepository.findOrdersByUserId(userId);

        if (orders instanceof Error) {
            return orders;
        }
        
        return orders;
    }
}