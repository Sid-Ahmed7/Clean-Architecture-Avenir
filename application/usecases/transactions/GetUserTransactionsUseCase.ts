import { StockTransactionEntity } from "../../../domain/entities/StockTransactionEntity";
import { StockTransactionRepositoryInterface } from "../../ports/repositories/stocks/StockTransactionRepositoryInterface";

export class GetUserTransactionsUseCase  {
    
    constructor(private transactionRepository: StockTransactionRepositoryInterface) {}

    public async execute(userId: string): Promise<StockTransactionEntity[] | Error> {
        const transactions = await this.transactionRepository.findTransactionsByUserId(userId)
        
        if (transactions instanceof Error) {
            return transactions;
        }

        return transactions;
    }
}