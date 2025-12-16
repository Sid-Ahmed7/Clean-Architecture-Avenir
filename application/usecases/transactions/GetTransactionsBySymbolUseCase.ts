import { StockTransactionEntity } from "../../../domain/entities/StockTransactionEntity";
import { StockTransactionRepositoryInterface } from "../../ports/repositories/stocks/StockTransactionRepositoryInterface";

export class GetTransactionsBySymbolUseCase {
    
    constructor(private transactionRepository: StockTransactionRepositoryInterface) {}

    public async execute(symbol: string): Promise<StockTransactionEntity[] | Error> {
        const transactions = await this.transactionRepository.findTransactionsBySymbol(symbol);
        
        if (transactions instanceof Error) {
            return transactions;
        }

        return transactions;
    }
}