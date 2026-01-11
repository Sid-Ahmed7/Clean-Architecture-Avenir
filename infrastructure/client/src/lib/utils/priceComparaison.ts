import { EXCHANGE_RATES } from "@/constants/rates";
import { Currency, PriceComparisonResult } from "@/types/priceComparison";

export function convertCurrency(amount: number,fromCurrency: Currency,toCurrency: Currency): number {
  if (fromCurrency === toCurrency){
    return amount;
  }
  
  const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency];
  if (!rate) {
    return amount;
  }
  
  return amount * rate;
}

export function comparePrices(marketPrice: number,marketCurrency: Currency,tradingPrice: number,tradingCurrency: Currency,significantThreshold: number = 5,criticalThreshold: number = 10): PriceComparisonResult {
  const marketPriceConverted = convertCurrency(marketPrice, marketCurrency, tradingCurrency);
  
  const absoluteDifference = tradingPrice - marketPriceConverted;
  const percentageDifference = ((absoluteDifference) / marketPriceConverted) * 100;
  
  const isAboveMarket = absoluteDifference > 0;
  const isBelowMarket = absoluteDifference < 0;
  const absPercentage = Math.abs(percentageDifference);
  const isSignificantGap = absPercentage > significantThreshold;
  const isCriticalGap = absPercentage > criticalThreshold;
  
  let indicatorColor: PriceComparisonResult["indicatorColor"];
  
  if (isCriticalGap) {
    indicatorColor = "red";
  } else if (isSignificantGap) {
    indicatorColor = "orange";
  } else if (isAboveMarket) {
    indicatorColor = "green";
  } else if (isBelowMarket) {
    indicatorColor = "yellow";
  } else {
    indicatorColor = "green";
  }
  
  return {
    marketPriceConverted,
    tradingPrice,
    targetCurrency: tradingCurrency,
    absoluteDifference,
    percentageDifference,
    isAboveMarket,
    isBelowMarket,
    isSignificantGap,
    isCriticalGap,
    indicatorColor,
  };
}


export function formatPrice(price: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    USD: "$",
    EUR: "€",
};
  return `${price.toFixed(2)} ${symbols[currency]}`;
}

export function getColorClasses(color: PriceComparisonResult["indicatorColor"]): {
  bg: string;
  border: string;
  text: string;
} {
  const classes = {
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
    yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700" },
    orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
    red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  };
  return classes[color];
}