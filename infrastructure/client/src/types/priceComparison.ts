export type Currency = "USD" | "EUR";

export interface PriceComparisonResult {
  marketPriceConverted: number;
  tradingPrice: number;
  targetCurrency: Currency;
  
  absoluteDifference: number;
  percentageDifference: number;
  
  isAboveMarket: boolean;
  isBelowMarket: boolean;
  isSignificantGap: boolean; 
  isCriticalGap: boolean;    
  
  indicatorColor: "green" | "red" | "yellow" | "orange";
}