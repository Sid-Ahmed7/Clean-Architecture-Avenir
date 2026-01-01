import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CreateStockUseCase } from "#application/usecases/stocks/CreateStockUseCase.js";
import { GetAllStockUseCase } from "#application/usecases/stocks/GetAllStockUseCase.js";
import { GetStockByIdUseCase } from "#application/usecases/stocks/GetStockByIdUseCase.js";
import { GetStockBySymbolUseCase } from "#application/usecases/stocks/GetStockBySymbolUseCase.js";
import { UpdateStockUseCase } from "#application/usecases/stocks/UpdateStockUseCase.js";
import { UpdateStockPriceUseCase } from "#application/usecases/stocks/UpdateStockPriceUseCase.js";
import { DeleteStockUseCase } from "#application/usecases/stocks/DeleteStockUseCase.js";
import { ChangeStockAvailabilityUseCase } from "#application/usecases/stocks/ChangeStockAvailabilityUseCase.js";
import { ListAvailableStocksUseCase } from "#application/usecases/stocks/ListAvailableStocksUseCase.js";
import { PurchaseIPOSharesUseCase } from "#application/usecases/stocks/PurchaseIPOSharesUseCase.js";
import { OpenIPOUseCase } from "#application/usecases/stocks/OpenIPOUseCase.js";
import { CloseIPOUseCase } from "#application/usecases/stocks/CloseIPOUseCase.js";
import type { StockRepositoryInterface } from "#application/ports/repositories/stocks/StockRepositoryInterface.js";
import type { StockOrderRepositoryInterface } from "#application/ports/repositories/stocks/StockOrderRepositoryInterface.js";
import type { StockHoldingRepositoryInterface } from "#application/ports/repositories/stocks/StockHoldingRepositoryInterface.js";
import type { OrderBookEngineService } from "#infrastructure/adapters/services/order/OrderBookEngineService.js";
import type { BankAccountService } from "#infrastructure/adapters/services/BankAccountService.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import { StockNotFoundError } from "#application/errors/StockNotFoundError.js";
import { InvalidStockSymbolError } from "#domain/errors/InvalidStockSymbolError.js";
import { InsufficientFundsError } from "#domain/errors/InsufficientFundsError.js";
import { IPONotActiveError } from "#application/errors/IPONotActiveError.js";
import { InvalidIPOOperationError } from "#domain/errors/InvalidIPOOperationError.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as stockValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/stock.js";

@inject()
export default class StocksController {
  constructor(
    private readonly stockRepository: StockRepositoryInterface,
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
    private readonly orderBookService: OrderBookEngineService,
    private readonly uuidService: CryptoUuidGenerator,
    private readonly holdingRepository: StockHoldingRepositoryInterface,
    private readonly accountService: BankAccountService
  ) {}

  async create({ request, response }: HttpContext) {
    const createStockUseCase = new CreateStockUseCase(this.stockRepository, this.uuidService);
    const input = await vine.validate({schema: stockValidator.createStockValidator, data: request.body()});

    const result = await createStockUseCase.execute(input);
    if (result instanceof Error) {
      if (result instanceof InvalidStockSymbolError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async getAll({ response }: HttpContext) {
    const getAllStocksUseCase = new GetAllStockUseCase(this.stockRepository);
    const stocks = await getAllStocksUseCase.execute();
    return response.status(200).json(stocks);
  }

  async getBySymbol({ request, response }: HttpContext) {
    const getStockBySymbolUseCase = new GetStockBySymbolUseCase(this.stockRepository);
    const symbol = request.param('symbol');

    if (!symbol) {
      return response.status(400).json({ error: "Stock symbol is required" });
    }

    const result = await getStockBySymbolUseCase.execute(symbol);
    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async update({ request, response }: HttpContext) {
    const updateStockUseCase = new UpdateStockUseCase(this.stockRepository);
    const input = await vine.validate({schema: stockValidator.updateStockValidator, data: request.body()});

    const result = await updateStockUseCase.execute(input);
    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InvalidStockSymbolError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }


  async getById({ request, response }: HttpContext) {
    const getStockByIdUseCase = new GetStockByIdUseCase(this.stockRepository);
    const id = request.param('id');

    if (!id) {
      return response.status(400).json({ error: "Stock ID is required" });
    }

    const result = await getStockByIdUseCase.execute(id);
    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async delete({ request, response }: HttpContext) {
    const deleteStockUseCase = new DeleteStockUseCase(this.stockRepository);
    const id = request.param('id');

    if (!id) {
      return response.status(400).json({ error: "Stock ID is required" });
    }

    const result = await deleteStockUseCase.execute(id);
    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json({ message: "Stock deleted successfully" });
  }

  async changeAvailability({ request, response }: HttpContext) {
    const changeStockAvailabilityUseCase = new ChangeStockAvailabilityUseCase(this.stockRepository);
    const id = request.param('id');

    if (!id) {
      return response.status(400).json({ error: "Stock ID is required" });
    }

    const input = await vine.validate({schema: stockValidator.changeAvailabilityValidator, data: request.body()});
    const result = await changeStockAvailabilityUseCase.execute(id, input.isActionAvailable);

    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async listAvailableStocks({ response }: HttpContext) {
    const listAvailableStocksUseCase = new ListAvailableStocksUseCase(this.stockRepository);
    const result = await listAvailableStocksUseCase.execute();

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async updatePrice({ request, response }: HttpContext) {
    const symbol = request.param('symbol');
    const updateStockPriceUseCase = new UpdateStockPriceUseCase(
      this.stockRepository,
      this.stockOrderRepository,
      this.orderBookService
    );

    if (!symbol) {
      return response.status(400).json({ error: "Stock symbol is required" });
    }

    const result = await updateStockPriceUseCase.execute(symbol);
    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async purchaseIPO({ request, response, auth }: HttpContext) {
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const input = await vine.validate({schema: stockValidator.purchaseIPOValidator, data: request.body()});

    const purchaseIPOSharesUseCase = new PurchaseIPOSharesUseCase(
      this.stockRepository,
      this.holdingRepository,
      this.accountService,
      this.uuidService
    );

    const result = await purchaseIPOSharesUseCase.execute({
      userId,
      stockSymbol: input.stockSymbol,
      quantity: input.quantity
    });

    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InsufficientFundsError) {
        return response.status(400).json({ error: result.message });
      }
      if (result instanceof IPONotActiveError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(400).json({ error: result.message });
    }

    return response.status(200).json({
      message: `Successfully purchased ${input.quantity} shares via IPO`,
      position: result
    });
  }

  async closeIPO({ request, response }: HttpContext) {
    const closeIPOUseCase = new CloseIPOUseCase(this.stockRepository);
    const symbol = request.param('symbol');

    if (!symbol) {
      return response.status(400).json({ error: "Stock symbol is required" });
    }

    const result = await closeIPOUseCase.execute(symbol);
    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof IPONotActiveError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json({
      message: `IPO closed for ${symbol}`,
      stock: result
    });
  }

  async launchIPO({ request, response }: HttpContext) {
    const symbol = request.param('symbol');
    const input = await vine.validate({schema: stockValidator.openIPOValidator, data: request.body()});

    if (!symbol) {
      return response.status(400).json({ error: "Stock symbol is required" });
    }

    const openIPOUseCase = new OpenIPOUseCase(this.stockRepository);
    const result = await openIPOUseCase.execute(symbol, input.sharesToMakeAvailable, input.ipoType);

    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof IPONotActiveError) {
        return response.status(400).json({ error: result.message });
      }
      if (result instanceof InvalidIPOOperationError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(400).json({ error: result.message });
    }

    return response.status(200).json({
      message: `IPO opened for ${symbol}`,
      stock: result
    });
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
