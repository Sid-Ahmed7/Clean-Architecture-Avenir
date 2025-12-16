import { StockOrderEntity } from "../../../domain/entities/StockOrderEntity";
import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";

export class GetAllOrdersUseCase {
    public constructor(private readonly stockOrderRepository: StockOrderRepositoryInterface){}

    public async execute(): Promise<StockOrderEntity[] | Error> {

            const orders = await this.stockOrderRepository.findAllOrders();
           
            if(orders instanceof Error){
                return orders;
            }

            return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    }
}
