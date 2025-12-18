import { Request, Response } from 'express';
import { StockTransactionRepositoryInterface } from "../../../../../application/ports/repositories/stocks/StockTransactionRepositoryInterface";
import { GetTransactionsBySymbolUseCase } from "../../../../../application/usecases/transactions/GetTransactionsBySymbolUseCase";
import { GetUserTransactionsUseCase } from "../../../../../application/usecases/transactions/GetUserTransactionsUseCase";

export class StockTransactionController {
    public constructor( private stockTransactionRepository: StockTransactionRepositoryInterface){}


    async getUserTransaction(req: Request, res: Response) {
        const userId = req.user?.userId;
        const getUserTransactionsUseCase = new GetUserTransactionsUseCase(this.stockTransactionRepository);
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }
        
        const result = await getUserTransactionsUseCase.execute(userId);
        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    async getTransactionBySymbol(req: Request, res: Response) {
        const stockSymbol = req.params.symbol;
        const getSymbolTransactionsUseCase = new GetTransactionsBySymbolUseCase(this.stockTransactionRepository);
        if (!stockSymbol) {
           return res.status(400).json({ error: "Missing stock symbol" });
        }
        
        const result = await getSymbolTransactionsUseCase.execute(stockSymbol);
        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }



}