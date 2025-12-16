export interface CreateStock {
    symbol: string;
    companyName: string;
    name: string;
    currentPrice: number;
    currency: string;
    isActionAvailable: boolean;
    totalShares: number;
}
