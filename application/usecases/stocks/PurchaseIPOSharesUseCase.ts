import { StockRepositoryInterface } from "../../ports/repositories/stocks/StockRepositoryInterface";
import { StockHoldingRepositoryInterface } from "../../ports/repositories/stocks/StockHoldingRepositoryInterface";
import { AccountService } from "../../ports/services/AccountService";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { StockHoldingEntity } from "../../../domain/entities/StockHoldingEntity";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";
import { PurchaseIPOShares } from "../../requests/PurchaseIPOShares";
import { IPONotActiveError } from "../../errors/IPONotActiveError";

export class PurchaseIPOSharesUseCase {

    private readonly TRANSACTION_FEE = 1;

    public constructor(
        private readonly stockRepository: StockRepositoryInterface,
        private readonly holdingRepository: StockHoldingRepositoryInterface,
        private readonly accountService: AccountService,
        private readonly uuidService: UuidGeneratorService
    ) {}

    public async execute(request: PurchaseIPOShares): Promise<StockHoldingEntity | Error> {
        const { userId, stockSymbol, quantity } = request;

        const stock = await this.stockRepository.findStockBySymbol(stockSymbol);
        if (stock instanceof Error) {
            return stock;
        }

        if (!stock.isIPOActive()) {
            return new IPONotActiveError("IPO is not active for this stock. Please use regular order placement.");
        }

        const totalCost = (quantity * stock.currentPrice) + this.TRANSACTION_FEE;

        const hasEnoughFunds = await this.accountService.hasEnoughFunds(userId, totalCost);
        if (!hasEnoughFunds) {
            return new InsufficientFundsError(`Insufficient funds: required ${totalCost}€`);
        }

        const purchaseResult = stock.purchaseIPOShares(quantity);
        if (purchaseResult instanceof Error) {
            return purchaseResult;
        }

        const debitResult = await this.accountService.debitAccount(userId, totalCost);
        if (debitResult instanceof Error) {
            stock.availableSharesForIPO += quantity;
            if (quantity > 0 && stock.availableSharesForIPO > 0) {
                stock.ipoActive = true;
            }
            return debitResult;
        }

        const updateStockResult = await this.stockRepository.updateStock(stock);
        if (updateStockResult instanceof Error) {
            await this.accountService.creditAccount(userId, totalCost);
            stock.availableSharesForIPO += quantity;
            if (quantity > 0 && stock.availableSharesForIPO > 0) {
                stock.ipoActive = true;
            }
            return updateStockResult;
        }

        const position = await this.holdingRepository.findPositionByUserIdAndSymbol(userId, stockSymbol);

        if (position instanceof Error) {
            const positionId = this.uuidService.generate();
            const totalInvested = quantity * stock.currentPrice;
            const newPosition = StockHoldingEntity.from(
                positionId,
                userId,
                stockSymbol,
                quantity,
                stock.currentPrice,
                totalInvested,
                new Date(),
                new Date(),
                0 
            );

            if (newPosition instanceof Error) {
                await this.accountService.creditAccount(userId, totalCost);
                stock.availableSharesForIPO += quantity;
                if (quantity > 0 && stock.availableSharesForIPO > 0) {
                    stock.ipoActive = true;
                }
                await this.stockRepository.updateStock(stock);
                return newPosition;
            }

            const createdPosition = await this.holdingRepository.createPosition(newPosition);
            if (createdPosition instanceof Error) {
                await this.accountService.creditAccount(userId, totalCost);
                stock.availableSharesForIPO += quantity;
                if (quantity > 0 && stock.availableSharesForIPO > 0) {
                    stock.ipoActive = true;
                }
                await this.stockRepository.updateStock(stock);
                return createdPosition;
            }

            return createdPosition;
        } else {
            position.addShares(quantity, stock.currentPrice);
            const updatedPosition = await this.holdingRepository.updatePosition(position);

            if (updatedPosition instanceof Error) {
                await this.accountService.creditAccount(userId, totalCost);
                stock.availableSharesForIPO += quantity;
                if (quantity > 0 && stock.availableSharesForIPO > 0) {
                    stock.ipoActive = true;
                }
                await this.stockRepository.updateStock(stock);
                return updatedPosition;
            }

            return updatedPosition;
        }
    }
}
