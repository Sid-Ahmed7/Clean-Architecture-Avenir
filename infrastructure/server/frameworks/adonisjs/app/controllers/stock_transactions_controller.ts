import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { GetUserTransactionsUseCase } from "#application/usecases/transactions/GetUserTransactionsUseCase.js";
import { GetTransactionsBySymbolUseCase } from "#application/usecases/transactions/GetTransactionsBySymbolUseCase.js";
import type { StockTransactionRepositoryInterface } from "#application/ports/repositories/stocks/StockTransactionRepositoryInterface.js";
import { AuthContext } from '#types/JwtPayload';

@inject()
export default class StockTransactionsController {
  constructor(
    private readonly transactionRepository: StockTransactionRepositoryInterface
  ) {}

  async getUserTransactions({ response, auth }: HttpContext) {
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const getUserTransactionsUseCase = new GetUserTransactionsUseCase(this.transactionRepository);
    const result = await getUserTransactionsUseCase.execute(userId);

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getTransactionsBySymbol({ request, response }: HttpContext) {
    const symbol = request.param('symbol');

    if (!symbol) {
      return response.status(400).json({ error: "Stock symbol is required" });
    }

    const getTransactionsBySymbolUseCase = new GetTransactionsBySymbolUseCase(
      this.transactionRepository
    );
    const result = await getTransactionsBySymbolUseCase.execute(symbol);

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
