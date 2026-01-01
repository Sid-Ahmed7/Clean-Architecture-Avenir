import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PlaceStockOrderUseCase } from "#application/usecases/orders/PlaceStockOrderUseCase.js";
import { GetUserOrdersUseCase } from "#application/usecases/orders/GetUserOrdersUseCase.js";
import { GetAllOrdersUseCase } from "#application/usecases/orders/GetAllOrdersUseCase.js";
import { CancelOrderUseCase } from "#application/usecases/orders/CancelOrderUseCase.js";
import { GetOrderBookBySymbolUseCase } from "#application/usecases/orders/GetOrderBookBySymbolUseCase.js";
import { FindMatchableOrdersUseCase } from "#application/usecases/orders/FindMatchableOrdersUseCase.js";
import { ExecuteOrderMatchUseCase } from "#application/usecases/orders/ExecuteOrderMatchUseCase.js";
import { AutoMatchOrdersUseCase } from "#application/usecases/orders/AutoMatchOrdersUseCase.js";
import { UpdateStockPriceUseCase } from "#application/usecases/stocks/UpdateStockPriceUseCase.js";
import { TransferFundsUseCase } from "#application/usecases/orders/TransferFundsUseCase.js";
import { UpdateBuyerPositionUseCase } from "#application/usecases/position/UpdateBuyerPositionUseCase.js";
import { UpdatedSellerPositionUseCase } from "#application/usecases/position/UpdatedSellerPositionUseCase.js";
import type { StockOrderRepositoryInterface } from "#application/ports/repositories/stocks/StockOrderRepositoryInterface.js";
import type { StockTransactionRepositoryInterface } from "#application/ports/repositories/stocks/StockTransactionRepositoryInterface.js";
import type { StockRepositoryInterface } from "#application/ports/repositories/stocks/StockRepositoryInterface.js";
import type { StockHoldingRepositoryInterface } from "#application/ports/repositories/stocks/StockHoldingRepositoryInterface.js";
import type { OrderMatchingEngineService } from "#infrastructure/adapters/services/order/OrderMatchingEngineService.js";
import type { OrderBookEngineService } from "#infrastructure/adapters/services/order/OrderBookEngineService.js";
import type { OrderValidationEngineService } from "#infrastructure/adapters/services/order/OrderValidationEngineService.js";
import type { BankAccountService } from "#infrastructure/adapters/services/BankAccountService.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import { StockNotFoundError } from "#application/errors/StockNotFoundError.js";
import { OrderNotFoundError } from "#application/errors/OrderNotFoundError.js";
import { OrderMatchingError } from "#domain/errors/OrderMatchingError.js";
import { InvalidQuantityError } from "#domain/errors/InvalidQuantityError.js";
import { InsufficientFundsError } from "#application/errors/InsufficientFundsError.js";
import { AccountNotFoundError } from "#application/errors/AccountNotFoundError.js";
import { PositionAlreadyExistsError } from "#application/errors/PositionAlreadyExistsError.js";
import { InvalidPriceError } from "#domain/errors/InvalidPriceError.js";
import { PositionNotFoundError } from "#application/errors/PositionNotFoundError.js";
import { IPONotActiveError } from "#application/errors/IPONotActiveError.js";
import { InsufficientAvailableSharesError } from "#application/errors/InsufficientAvailableSharesError.js";
import { StockNotAvailableError } from "#application/errors/StockNotAvailableError.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as orderValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/order.js";

@inject()
export default class StockOrdersController {
  constructor(
    private readonly stockOrderRepository: StockOrderRepositoryInterface,
    private readonly transactionRepository: StockTransactionRepositoryInterface,
    private readonly stockRepository: StockRepositoryInterface,
    private readonly holdingRepository: StockHoldingRepositoryInterface,
    private readonly matchingService: OrderMatchingEngineService,
    private readonly stockOrderService: OrderBookEngineService,
    private readonly orderValidationService: OrderValidationEngineService,
    private readonly accountService: BankAccountService,
    private readonly uuidGenerator: CryptoUuidGenerator
  ) {}

  async placeOrder({ request, response, auth }: HttpContext) {
    const placeStockOrderUseCase = new PlaceStockOrderUseCase(
      this.stockOrderRepository,
      this.stockRepository,
      this.orderValidationService,
      this.uuidGenerator,
      this.accountService,
      this.holdingRepository
    );

    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const input = await vine.validate({schema: orderValidator.placeOrderValidator, data: request.body()});
    const result = await placeStockOrderUseCase.execute(userId, input);

    if (result instanceof Error) {
      if (result instanceof StockNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof StockNotAvailableError) {
        return response.status(400).json({ error: result.message });
      }
      if (result instanceof IPONotActiveError) {
        return response.status(400).json({ error: result.message });
      }
      if (result instanceof InsufficientAvailableSharesError) {
        return response.status(400).json({ error: result.message });
      }
      if (result instanceof PositionNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InsufficientFundsError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    const findMatchableOrdersUseCase = new FindMatchableOrdersUseCase(
      this.stockOrderRepository,
      this.stockOrderService
    );
    const updateStockPriceUseCase = new UpdateStockPriceUseCase(
      this.stockRepository,
      this.stockOrderRepository,
      this.stockOrderService
    );
    const executeOrderMatchUseCase = new ExecuteOrderMatchUseCase(
      this.stockOrderRepository,
      this.transactionRepository,
      this.matchingService,
      this.uuidGenerator,
      updateStockPriceUseCase
    );
    const transferFundsUseCase = new TransferFundsUseCase(this.accountService);
    const updateBuyerPositionUseCase = new UpdateBuyerPositionUseCase(
      this.holdingRepository,
      this.uuidGenerator
    );
    const updateSellerPositionUseCase = new UpdatedSellerPositionUseCase(
      this.holdingRepository,
      this.uuidGenerator
    );

    const autoMatchOrdersUseCase = new AutoMatchOrdersUseCase(
      this.stockOrderRepository,
      findMatchableOrdersUseCase,
      executeOrderMatchUseCase,
      transferFundsUseCase,
      updateBuyerPositionUseCase,
      updateSellerPositionUseCase
    );

    await autoMatchOrdersUseCase.execute(result.stockSymbol);

    return response.status(201).json(result);
  }

  async getUserOrders({ response, auth }: HttpContext) {
    const userId = auth?.userId;
    const getUserOrdersUseCase = new GetUserOrdersUseCase(this.stockOrderRepository);

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }

    const result = await getUserOrdersUseCase.execute(userId);
    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getAllOrders({ response }: HttpContext) {
    const getAllOrdersUseCase = new GetAllOrdersUseCase(this.stockOrderRepository);

    const result = await getAllOrdersUseCase.execute();
    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async matchOrders({ request, response }: HttpContext) {
    const symbol = request.param('symbol');

    if (!symbol) {
      return response.status(400).json({ error: "Any symbol provided" });
    }

    const findMatchableOrdersUseCase = new FindMatchableOrdersUseCase(
      this.stockOrderRepository,
      this.stockOrderService
    );
    const updateStockPriceUseCase = new UpdateStockPriceUseCase(
      this.stockRepository,
      this.stockOrderRepository,
      this.stockOrderService
    );
    const executeOrderMatchUseCase = new ExecuteOrderMatchUseCase(
      this.stockOrderRepository,
      this.transactionRepository,
      this.matchingService,
      this.uuidGenerator,
      updateStockPriceUseCase
    );
    const transferFundsUseCase = new TransferFundsUseCase(this.accountService);
    const updateBuyerPositionUseCase = new UpdateBuyerPositionUseCase(
      this.holdingRepository,
      this.uuidGenerator
    );
    const updateSellerPositionUseCase = new UpdatedSellerPositionUseCase(
      this.holdingRepository,
      this.uuidGenerator
    );

    const autoMatchOrdersUseCase = new AutoMatchOrdersUseCase(
      this.stockOrderRepository,
      findMatchableOrdersUseCase,
      executeOrderMatchUseCase,
      transferFundsUseCase,
      updateBuyerPositionUseCase,
      updateSellerPositionUseCase
    );

    const executedTransactions = await autoMatchOrdersUseCase.execute(symbol);

    if (executedTransactions instanceof Error) {
      if (executedTransactions instanceof OrderNotFoundError) {
        return response.status(404).json({ error: executedTransactions.message });
      }
      if (executedTransactions instanceof OrderMatchingError) {
        return response.status(400).json({ error: executedTransactions.message });
      }
      if (executedTransactions instanceof InvalidQuantityError) {
        return response.status(400).json({ error: executedTransactions.message });
      }
      if (executedTransactions instanceof AccountNotFoundError) {
        return response.status(404).json({ error: executedTransactions.message });
      }
      if (executedTransactions instanceof InsufficientFundsError) {
        return response.status(400).json({ error: executedTransactions.message });
      }
      if (executedTransactions instanceof PositionNotFoundError) {
        return response.status(404).json({ error: executedTransactions.message });
      }
      if (executedTransactions instanceof PositionAlreadyExistsError) {
        return response.status(409).json({ error: executedTransactions.message });
      }
      if (executedTransactions instanceof InvalidPriceError) {
        return response.status(400).json({ error: executedTransactions.message });
      }
      return response.status(500).json({ error: executedTransactions.message });
    }

    return response.status(200).json({
      message: `Matched ${executedTransactions.length} orders`,
      transactions: executedTransactions
    });
  }

  async cancelOrder({ request, response, auth }: HttpContext) {
    const orderId = request.param('id');
    const userId = auth?.userId;
    const cancelOrderUseCase = new CancelOrderUseCase(
      this.stockOrderRepository,
      this.accountService,
      this.holdingRepository
    );

    if (!userId) {
      return response.status(401).json({ error: "Unauthorized access" });
    }
    if (!orderId) {
      return response.status(400).json({ error: "Order ID is required" });
    }

    const result = await cancelOrderUseCase.execute(orderId, userId);
    if (result instanceof Error) {
      if (result instanceof OrderNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json({ message: "Order cancelled successfully" });
  }

  async getOrderBookBySymbol({ request, response }: HttpContext) {
    const symbol = request.param('symbol');
    const getOrderBookBySymbolUseCase = new GetOrderBookBySymbolUseCase(this.stockOrderRepository);

    if (!symbol) {
      return response.status(400).json({ error: "Symbol is required" });
    }

    const result = await getOrderBookBySymbolUseCase.execute(symbol);

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
