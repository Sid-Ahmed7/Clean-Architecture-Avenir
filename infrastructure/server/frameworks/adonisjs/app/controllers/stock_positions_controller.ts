import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { GetUserPositionsUseCase } from "#application/usecases/position/GetUserPositionsUseCase.js";
import { GetPositionDetailsUseCase } from "#application/usecases/position/GetPositionDetailsUseCase.js";
import type { StockHoldingRepositoryInterface } from "#application/ports/repositories/stocks/StockHoldingRepositoryInterface.js";
import type { StockRepositoryInterface } from "#application/ports/repositories/stocks/StockRepositoryInterface.js";
import { PositionNotFoundError } from "#application/errors/PositionNotFoundError.js";
import { StockNotFoundError } from "#application/errors/StockNotFoundError.js";
import { AuthContext } from '#types/JwtPayload';

@inject()
export default class StockPositionsController {
  constructor(
    private readonly holdingRepository: StockHoldingRepositoryInterface,
    private readonly stockRepository: StockRepositoryInterface
  ) {}

  async getUserPositions({ response, auth }: HttpContext) {
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const getUserPositionsUseCase = new GetUserPositionsUseCase(this.holdingRepository, this.stockRepository);
    const result = await getUserPositionsUseCase.execute(userId);

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getPositionBySymbol({ request, response, auth }: HttpContext) {
    const userId = auth?.userId;
    const symbol = request.param('symbol');

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    if (!symbol) {
      return response.status(400).json({ error: "Stock symbol is required" });
    }

    const getPositionDetailsUseCase = new GetPositionDetailsUseCase(this.holdingRepository, this.stockRepository);
    const result = await getPositionDetailsUseCase.execute(userId, symbol);

    if (result instanceof Error) {
      if (result instanceof PositionNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
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
