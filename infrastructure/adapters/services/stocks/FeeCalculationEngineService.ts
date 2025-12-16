import { FeeCalculationService } from "../../../../application/ports/services/stocks/FeeCalculationService";

export class FeeCalculationEngineService implements FeeCalculationService {
    private readonly TRANSACTION_FEE = 1;


    public calculateTransactionFee(): number {
        return this.TRANSACTION_FEE;
    }

    public calculateTotalBuyCost(quantity: number, pricePerShare: number): number {
        const subTotal = quantity * pricePerShare;
        const fee = this.calculateTransactionFee();
        return subTotal + fee;
    }

       public calculateNetSellRevenue(quantity: number, pricePerShare: number): number {
        const subTotal = quantity * pricePerShare;
        const fee = this.calculateTransactionFee();
        return subTotal - fee;
    }
}