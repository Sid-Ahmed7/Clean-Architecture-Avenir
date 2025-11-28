import { OrderValidation } from "../../../../application/interfaces/OrderValidation";
import { AccountService } from "../../../../application/ports/services/AccountService";
import { OrderValidationService } from "../../../../application/ports/services/order/OrderValidationService";
import { StockHoldingService } from "../../../../application/ports/services/stocks/StockHoldingService";
import { OrderTypeEnum } from "../../../../domain/enums/OrderTypeEnum";
import { InsufficientFundsError } from "../../../../domain/errors/InsufficientFundsError";
import { InsufficientSharesError } from "../../../../domain/errors/InsufficientSharesError ";

export class OrderValidationEngineService implements OrderValidationService {
    private readonly TRANSACTION_FEE = 1; 
    
    public constructor(
        private accountService: AccountService,
        private stockPositionService: StockHoldingService
    ){}

    public async validateOrder(orderValidation: OrderValidation): Promise<void | InsufficientFundsError | InsufficientSharesError> {
        if(orderValidation.orderType === OrderTypeEnum.BUY) {
            const totalCost = orderValidation.quantity * orderValidation.orderPrice + this.TRANSACTION_FEE;
            const hasEnoughFunds = await this.accountService.hasEnoughFunds(orderValidation.userId, totalCost);
            if(!hasEnoughFunds) {
                return new InsufficientFundsError(`Insufficient funds: required ${totalCost}€`);
            } 
        } else {
            const hasEnoughShares = await this.stockPositionService.hasEnoughShares(orderValidation.userId, orderValidation.stockSymbol, orderValidation.quantity);
             if (!hasEnoughShares) {
                return new InsufficientSharesError(`Insufficient shares to sell ${orderValidation.quantity} of ${orderValidation.stockSymbol}`);
        }
    }
    }
}