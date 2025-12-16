import { Request, Response } from 'express';
import { InMemoryStockOrderRepository } from '../../../../adapters/repositories/InMemoryStockOrderRepository';
import {OrderMatchingEngineService} from "../../../../adapters/services/order/OrderMatchingEngineService";
import {OrderBookEngineService} from "../../../../adapters/services/order/OrderBookEngineService";
import {OrderValidationEngineService} from "../../../../adapters/services/order/OrderValidationEngineService";
import {BankAccountService} from "../../../../adapters/services/BankAccountService";
import {ExecuteOrderMatchUseCase} from "../../../../../application/usecases/orders/ExecuteOrderMatchUseCase";
import {FindMatchableOrdersUseCase} from "../../../../../application/usecases/orders/FindMatchableOrdersUseCase";
import {GetUserOrdersUseCase} from "../../../../../application/usecases/orders/GetUserOrdersUseCase";
import {GetAllOrdersUseCase} from "../../../../../application/usecases/orders/GetAllOrdersUseCase";
import {CancelOrderUseCase} from "../../../../../application/usecases/orders/CancelOrderUseCase";
import {GetOrderBookBySymbolUseCase} from "../../../../../application/usecases/orders/GetOrderBookBySymbolUseCase";
import {PlaceStockOrderUseCase} from "../../../../../application/usecases/orders/PlaceStockOrderUseCase";
import {TransferFundsUseCase} from "../../../../../application/usecases/orders/TransferFundsUseCase";
import {UpdateBuyerPositionUseCase} from "../../../../../application/usecases/position/UpdateBuyerPositionUseCase";
import {UpdatedSellerPositionUseCase} from "../../../../../application/usecases/position/UpdatedSellerPositionUseCase";
import {AutoMatchOrdersUseCase} from "../../../../../application/usecases/orders/AutoMatchOrdersUseCase";
import {UpdateStockPriceUseCase} from "../../../../../application/usecases/stocks/UpdateStockPriceUseCase";
import { OrderTypeEnum } from '../../../../../domain/enums/OrderTypeEnum';
import { StockNotFoundError } from '../../../../../application/errors/StockNotFoundError';
import { OrderNotFoundError } from '../../../../../application/errors/OrderNotFoundError';
import { OrderMatchingError } from '../../../../../domain/errors/OrderMatchingError';
import { InvalidQuantityError } from '../../../../../domain/errors/InvalidQuantityError';
import { InsufficientFundsError } from '../../../../../domain/errors/InsufficientFundsError';
import { AccountNotFoundError } from '../../../../../application/errors/AccountNotFoundError';
import { PositionAlreadyExistsError } from '../../../../../application/errors/PositionAlreadyExistsError';
import { InvalidPriceError } from '../../../../../domain/errors/InvalidPriceError';
import { PositionNotFoundError } from '../../../../../application/errors/PositionNotFoundError';
import { IPONotActiveError } from '../../../../../application/errors/IPONotActiveError';
import { InsufficientAvailableSharesError } from '../../../../../application/errors/InsufficientAvailableSharesError';
import { StockNotAvailableError } from '../../../../../application/errors/StockNotAvailableError';
import { InMemoryStockTransactionRepository } from '../../../../adapters/repositories/InMemoryStockTransactionRepository';
import { InMemoryStockRepository } from '../../../../adapters/repositories/InMemoryStockRepository';
import { InMemoryStockHoldingRepository } from '../../../../adapters/repositories/InMemoryStockHoldingRepository';
import { CryptoUuidGenerator } from '../../../../adapters/services/CryptoUuidGenerator';
import { placeOrderSchema } from '../schemas/order/placeOrderSchema';


export class StockOrderController {

    public constructor(
        private readonly stockOrderRepository: InMemoryStockOrderRepository,
        private readonly transactionRepository: InMemoryStockTransactionRepository,
        private readonly stockRepository: InMemoryStockRepository,
        private readonly holdingRepository: InMemoryStockHoldingRepository,
        private readonly matchingService: OrderMatchingEngineService,
        private readonly stockOrderService: OrderBookEngineService,
        private readonly orderValidationService: OrderValidationEngineService,
        private readonly accountService: BankAccountService,
        private readonly uuidGenerator: CryptoUuidGenerator
    ){}


    async placeOrder(req: Request, res: Response) {
        const placeStockOrderUseCase = new PlaceStockOrderUseCase(this.stockOrderRepository, this.stockRepository, this.orderValidationService, this.uuidGenerator, this.accountService, this.holdingRepository);
        const userId = req.user?.userId;

        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const parseResult = placeOrderSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const result = await placeStockOrderUseCase.execute(userId, parseResult.data)

        if(result instanceof Error) {
            if(result instanceof StockNotFoundError){
                return res.status(404).json({ error: result.message });
            }
            if(result instanceof StockNotAvailableError){
                return res.status(400).json({ error: result.message });
            }
            if(result instanceof IPONotActiveError){
                return res.status(400).json({ error: result.message });
            }
            if(result instanceof InsufficientAvailableSharesError){
                return res.status(400).json({ error: result.message });
            }
            if(result instanceof PositionNotFoundError){
                return res.status(404).json({ error: result.message });
            }
            if(result instanceof InsufficientFundsError){
                return res.status(400).json({ error: result.message });
            }
            return res.status(500).json({error: result.message});
        }

        const findMatchableOrdersUseCase = new FindMatchableOrdersUseCase(this.stockOrderRepository, this.stockOrderService);
        const updateStockPriceUseCase = new UpdateStockPriceUseCase(this.stockRepository, this.stockOrderRepository, this.stockOrderService);
        const executeOrderMatchUseCase = new ExecuteOrderMatchUseCase(this.stockOrderRepository, this.transactionRepository, this.matchingService, this.uuidGenerator, updateStockPriceUseCase);
        const transferFundsUseCase = new TransferFundsUseCase(this.accountService);
        const updateBuyerPositionUseCase = new UpdateBuyerPositionUseCase(this.holdingRepository, this.uuidGenerator);
        const updateSellerPositionUseCase = new UpdatedSellerPositionUseCase(this.holdingRepository, this.uuidGenerator);

        const autoMatchOrdersUseCase = new AutoMatchOrdersUseCase(
            this.stockOrderRepository,
            findMatchableOrdersUseCase,
            executeOrderMatchUseCase,
            transferFundsUseCase,
            updateBuyerPositionUseCase,
            updateSellerPositionUseCase
        );

            const transactions = await autoMatchOrdersUseCase.execute(result.stockSymbol);

        return res.status(201).json(result);
    }

    public async getUserOrders(req: Request, res: Response) {
        const userId = req.user?.userId;
        const getUserOrdersUseCase = new GetUserOrdersUseCase(this.stockOrderRepository);

        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }

        const result = await getUserOrdersUseCase.execute(userId);
         if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    public async getAllOrders(req: Request, res: Response) {
        const getAllOrdersUseCase = new GetAllOrdersUseCase(this.stockOrderRepository);

        const result = await getAllOrdersUseCase.execute();
        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }

    public async matchOrders(req: Request, res: Response) {
        const symbol = req.params.symbol;

        if (!symbol){
            return res.status(400).json({ error: "Any symbol provided" });
        }

        const findMatchableOrdersUseCase = new FindMatchableOrdersUseCase(this.stockOrderRepository, this.stockOrderService);
        const updateStockPriceUseCase = new UpdateStockPriceUseCase(this.stockRepository, this.stockOrderRepository, this.stockOrderService);
        const executeOrderMatchUseCase = new ExecuteOrderMatchUseCase(this.stockOrderRepository, this.transactionRepository, this.matchingService, this.uuidGenerator, updateStockPriceUseCase);
        const transferFundsUseCase = new TransferFundsUseCase(this.accountService);
        const updateBuyerPositionUseCase = new UpdateBuyerPositionUseCase(this.holdingRepository, this.uuidGenerator);
        const updateSellerPositionUseCase = new UpdatedSellerPositionUseCase(this.holdingRepository, this.uuidGenerator);

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
            if(executedTransactions instanceof OrderNotFoundError) {
                return res.status(404).json({error: executedTransactions.message});
            }
            if(executedTransactions instanceof OrderMatchingError) {
                return res.status(400).json({error: executedTransactions.message});
            }
            if(executedTransactions instanceof InvalidQuantityError) {
                return res.status(400).json({error: executedTransactions.message});
            }
            if(executedTransactions instanceof AccountNotFoundError) {
                return res.status(404).json({error: executedTransactions.message});
            }
            if(executedTransactions instanceof InsufficientFundsError) {
                return res.status(400).json({error: executedTransactions.message});
            }
            if(executedTransactions instanceof PositionNotFoundError) {
                return res.status(404).json({error: executedTransactions.message});
            }
            if(executedTransactions instanceof PositionAlreadyExistsError) {
                return res.status(409).json({error: executedTransactions.message});
            }
            if(executedTransactions instanceof InvalidPriceError) {
                return res.status(400).json({error: executedTransactions.message});
            }
            return res.status(500).json({ error: executedTransactions.message });
        }

        res.status(200).json({
            message: `Matched ${executedTransactions.length} orders`,
            transactions: executedTransactions
        });
    }

    async cancelOrder(req: Request, res: Response) {
        const { id: orderId } = req.params;
        const userId = req.user?.userId;
        const cancelOrderUseCase = new CancelOrderUseCase(this.stockOrderRepository, this.accountService, this.holdingRepository);
        if(!userId) {
            return res.status(401).json({error: "Unauthorized access"});
        }
        if(!orderId) {
            return res.status(400).json({error: "Order ID is required"});
        }
        const result = await cancelOrderUseCase.execute(orderId, userId);
        if(result instanceof Error) {
            if(result instanceof OrderNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json({message: "Order cancelled successfully"});
    }

    public async getOrderBookBySymbol(req: Request, res: Response) {
        const { symbol } = req.params;
        const getOrderBookBySymbolUseCase = new GetOrderBookBySymbolUseCase(this.stockOrderRepository);

        if (!symbol) {
            return res.status(400).json({ error: "Symbol is required" });
        }

        const result = await getOrderBookBySymbolUseCase.execute(symbol);

        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(200).json(result);
    }
}