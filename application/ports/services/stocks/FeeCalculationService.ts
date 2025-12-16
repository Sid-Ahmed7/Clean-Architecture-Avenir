export interface FeeCalculationService {
    calculateTransactionFee(): number;
    calculateTotalBuyCost(quantity: number, pricePerShare: number): number;
    calculateNetSellRevenue(quantity: number, pricePerShare: number): number;
}