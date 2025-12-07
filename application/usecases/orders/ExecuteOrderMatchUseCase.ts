import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { StockOrderRepositoryInterface } from "../../ports/repositories/stocks/StockOrderRepositoryInterface";
import {StockTransactionRepositoryInterface} from "../../ports/repositories/stocks/StockTransactionRepositoryInterface";
import { OrderMatchingService } from "../../ports/services/order/OrderMatchingService";
import { StockTransactionEntity } from "../../../domain/entities/StockTransactionEntity";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
export class ExecuteOrderMatchUseCase {

    public constructor(
        private readonly stockOrderRepository: StockOrderRepositoryInterface,
        private readonly transactionRepository: StockTransactionRepositoryInterface,
        private readonly matchingService: OrderMatchingService, 
        private readonly uuidService: UuidGeneratorService
    ){}


    public async execute(buyOrderId: string, sellOrderId: string): Promise<StockTransactionEntity | Error> {
        const buyOrder = await this.stockOrderRepository.findOrderById(buyOrderId);
        if (buyOrder instanceof Error) {
            return buyOrder;
        }

        const sellOrder = await this.stockOrderRepository.findOrderById(sellOrderId);
        if (sellOrder instanceof Error) {
            return sellOrder;
        }

        const matchDetails = this.matchingService.determineMatchDetails(buyOrder, sellOrder);
        if(matchDetails instanceof Error) {
            return matchDetails;
        }

        const {quantity, executionPrice} = matchDetails;

        const id = this.uuidService.generate();

        const transaction = StockTransactionEntity.from(id, buyOrder.id, sellOrder.id, buyOrder.stockSymbol, quantity, executionPrice, buyOrder.userId, sellOrder.userId, buyOrder.fee, sellOrder.fee, new Date());
        if(transaction instanceof Error) {
            return transaction;
        }

        const savedTransaction = await this.transactionRepository.createTransaction(transaction);
        if (savedTransaction instanceof Error){
            return savedTransaction;
        }

        const buyResult = buyOrder.executePartially(quantity);
        if(buyResult instanceof Error) {
            return buyResult
        }

        const sellResult = sellOrder.executePartially(quantity);
        if(sellResult instanceof Error) {
            return sellResult
        }

        await this.stockOrderRepository.updateOrder(buyOrder);
        await this.stockOrderRepository.updateOrder(sellOrder);

        return savedTransaction;
    }







}