import { Request, Response } from 'express';
import { InMemoryStockOrderRepository } from '../../../../adapters/repositories/InMemoryStockOrderRepository';
import {OrderMatchingEngineService} from "../../../../adapters/services/order/OrderMatchingEngineService";
import {OrderBookEngineService} from "../../../../adapters/services/order/OrderBookEngineService";
import {OrderValidationEngineService} from "../../../../adapters/services/order/OrderValidationEngineService";
import {BankAccountService} from "../../../../adapters/services/BankAccountService";
import {ExecuteOrderMatchUseCase} from "../../../../../application/usecases/orders/ExecuteOrderMatchUseCase";
import {FindMatchableOrdersUseCase} from "../../../../../application/usecases/orders/FindMatchableOrdersUseCase";
import {GetUserOrdersUseCase} from "../../../../../application/usecases/orders/GetUserOrdersUseCase";
import {PlaceStockOrderUseCase} from "../../../../../application/usecases/orders/PlaceStockOrderUseCase";
import {TransferFundsUseCase} from "../../../../../application/usecases/orders/TransferFundsUseCase";
import {UpdateBuyerPositionUseCase} from "../../../../../application/usecases/position/UpdateBuyerPositionUseCase";
import {UpdatedSellerPositionUseCase} from "../../../../../application/usecases/position/UpdatedSellerPositionUseCase";
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
        const placeStockOrderUseCase = new PlaceStockOrderUseCase(this.stockOrderRepository, this.stockRepository, this.orderValidationService, this.uuidGenerator);
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
                res.status(400).json({ error: result.message });
            }
            return res.status(500).json({error: result.message});
        }
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

    public async matchOrders(req: Request, res: Response) {
        const symbol = req.params.symbol;
        const findMatchableOrdersUseCase = new FindMatchableOrdersUseCase(this.stockOrderRepository, this.stockOrderService);
        const executeOrderMatchUseCase = new ExecuteOrderMatchUseCase(this.stockOrderRepository,this.transactionRepository,this.matchingService, this.uuidGenerator);        
        const transferFundsUseCase = new TransferFundsUseCase(this.accountService);      
        const updateBuyerPositionUseCase = new UpdateBuyerPositionUseCase(this.holdingRepository, this.uuidGenerator);
        const updateSellerPositionUseCase = new UpdatedSellerPositionUseCase(this.holdingRepository);

        if (!symbol){
            return res.status(400).json({ error: "Any symbol provided" });
        }

        const matchableOrders = await findMatchableOrdersUseCase.execute(symbol);
        
        if (matchableOrders instanceof Error) {
            return res.status(500).json({ error: matchableOrders.message });
        }

        const executedTransactions = [];

        for(const match of matchableOrders) {
            const transaction = await executeOrderMatchUseCase.execute(match.buyOrderId, match.sellOrderId);
            if (transaction instanceof Error) {
                if(transaction instanceof OrderNotFoundError) {
                    return res.status(404).json({error: transaction.message});
                }
                if(transaction instanceof OrderMatchingError) {
                    return res.status(400).json({error: transaction.message});
                }
                if(transaction instanceof InvalidQuantityError) {
                    return res.status(400).json({error: transaction.message});
                }
                return res.status(500).json({ error: transaction.message });
            }
        
            const transferResult = await transferFundsUseCase.execute({
                buyerUserId: transaction.buyerUserId,
                sellerUserId: transaction.sellerUserId,
                quantity: transaction.quantity,
                executionPrice: transaction.executionPrice,
                buyerFee: transaction.buyerFee,
                sellerFee: transaction.sellerFee,
            });

            if (transferResult instanceof Error) {
                if(transferResult instanceof AccountNotFoundError) {
                    return res.status(404).json({error: transferResult.message});
                }
                if(transferResult instanceof InsufficientFundsError) {
                    return res.status(400).json({error: transferResult.message});
                }
                return res.status(500).json({ error: transferResult.message });
            }
            const updateBuyer = await updateBuyerPositionUseCase.execute({
                userId: transaction.buyerUserId,
                stockSymbol: transaction.stockSymbol,
                quantity: transaction.quantity,
                pricePerShare: transaction.executionPrice,
            });

            if (updateBuyer instanceof Error) {
                if(updateBuyer instanceof PositionNotFoundError) {
                    return res.status(404).json({error: updateBuyer.message});
                }
                if(updateBuyer instanceof PositionAlreadyExistsError) {
                    return res.status(409).json({error: updateBuyer.message});
                }
                if(updateBuyer instanceof InvalidPriceError) {
                    return res.status(400).json({error: updateBuyer.message});
                }
                return res.status(500).json({ error: updateBuyer.message });
            }

            const updateSeller = await updateSellerPositionUseCase.execute({
                userId: transaction.sellerUserId,
                stockSymbol: transaction.stockSymbol,
                quantity: transaction.quantity,
            });
            if (updateSeller instanceof Error) {
                if(updateSeller instanceof PositionAlreadyExistsError) {
                    return res.status(404).json({error: updateSeller.message});
                }
                if(updateBuyer instanceof InvalidQuantityError) {
                    return res.status(400).json({error: updateSeller.message});
                }
                return res.status(500).json({ error: updateSeller.message });
            }
            
            executedTransactions.push(transaction);
        }

         res.status(200).json({message: `Matched ${executedTransactions.length} orders`,transactions: executedTransactions});
    }
}