export interface Stocks{
  id: string;
  symbol: string;
  companyName: string;
  name: string;
  currentPrice: number;
  previousPrice?: number;
  rateOfChange: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  isActionAvailable: boolean;
  totalShares: number;
  ipoActive: boolean;
  availableSharesForIPO: number;
}

export interface StockWithDetails extends Stocks {
  open: number;
  high: number;
  low: number;
  volume?: number;
  averageVolume?: number;
}