import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";
import { StockTransactionRepositoryInterface } from "../../ports/repositories/stocks/StockTransactionRepositoryInterface";
import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { OrderMatchingService } from "../../ports/services/order/OrderMatchingService";
import { OrderBookService } from "../../ports/services/order/OrderBookService";
import { AccountService } from "../../ports/services/AccountService";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { FindMatchableOrdersUseCase } from "./FindMatchableOrdersUseCase";
import { ExecuteOrderMatchUseCase } from "./ExecuteOrderMatchUseCase";
import { TransferFundsUseCase } from "./TransferFundsUseCase";
import { UpdateBuyerPositionUseCase } from "../position/UpdateBuyerPositionUseCase";
import { UpdatedSellerPositionUseCase } from "../position/UpdatedSellerPositionUseCase";
import { StockTransactionEntity } from "../../../domain/entities/StockTransactionEntity";

export class AutoMatchOrdersUseCase {

    public constructor(
        private readonly stockOrderRepository: StockOrderRepositoryInterface,
        private readonly findMatchableOrdersUseCase: FindMatchableOrdersUseCase,
        private readonly executeOrderMatchUseCase: ExecuteOrderMatchUseCase,
        private readonly transferFundsUseCase: TransferFundsUseCase,
        private readonly updateBuyerPositionUseCase: UpdateBuyerPositionUseCase,
        private readonly updateSellerPositionUseCase: UpdatedSellerPositionUseCase
    ) {}


    public async execute(stockSymbol: string): Promise<StockTransactionEntity[] | Error> {

        const matchableOrders = await this.findMatchableOrdersUseCase.execute(stockSymbol);

        if (matchableOrders instanceof Error) {
            return matchableOrders;
        }

        if (matchableOrders.length === 0) {
            return [];
        }

        const executedTransactions: StockTransactionEntity[] = [];

        for (const match of matchableOrders) {
            const buyOrder = await this.stockOrderRepository.findOrderById(match.buyOrderId);
            const sellOrder = await this.stockOrderRepository.findOrderById(match.sellOrderId);

            if (buyOrder instanceof Error){
                return buyOrder;
            }

            if (sellOrder instanceof Error){
                return sellOrder;
            }

            const buyerFeesPaid = buyOrder.areFeesPaid();
            const sellerFeesPaid = sellOrder.areFeesPaid();

            const transaction = await this.executeOrderMatchUseCase.execute(match.buyOrderId, match.sellOrderId);
            if (transaction instanceof Error) {
                return transaction;
            }

            const transferResult = await this.transferFundsUseCase.execute({
                buyerUserId: transaction.buyerUserId,
                sellerUserId: transaction.sellerUserId,
                quantity: transaction.quantity,
                executionPrice: transaction.executionPrice,
                buyerFee: transaction.buyerFee,
                sellerFee: transaction.sellerFee,
                buyerFeesPaid: buyerFeesPaid,
                sellerFeesPaid: sellerFeesPaid,
            });

            if (transferResult instanceof Error) {
                return transferResult;
            }

            if (!buyerFeesPaid) {
                buyOrder.markFeesAsPaid();
                await this.stockOrderRepository.updateOrder(buyOrder);
            }
            if (!sellerFeesPaid) {
                sellOrder.markFeesAsPaid();
                await this.stockOrderRepository.updateOrder(sellOrder);
            }

            const updateBuyer = await this.updateBuyerPositionUseCase.execute({
                userId: transaction.buyerUserId,
                stockSymbol: transaction.stockSymbol,
                quantity: transaction.quantity,
                pricePerShare: transaction.executionPrice,
            });

            if (updateBuyer instanceof Error) {
                return updateBuyer;
            }

            const updateSeller = await this.updateSellerPositionUseCase.execute({
                userId: transaction.sellerUserId,
                stockSymbol: transaction.stockSymbol,
                quantity: transaction.quantity,
                pricePerShare: transaction.executionPrice,
            });

            if (updateSeller instanceof Error) {
                return updateSeller;
            }

            executedTransactions.push(transaction);
        }

        return executedTransactions;
    }
}
