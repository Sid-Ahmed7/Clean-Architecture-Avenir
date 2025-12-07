export interface CreateStock {
    symbol: string;
    companyName: string;
    name: string;
    currentPrice: number;
    rateOfChange: number;
    currency: string;
    isActionAvailable: boolean;
    previousPrice?: number;
}
