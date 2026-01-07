"use client";

import { Stocks } from "@/types/stocks";
import { Stock as ApiStock } from "@/types/stock";
import { StockCard } from "./StockCard";
import { ApiPriceChart } from "./StockChart";
import { StocksCard } from "./StocksCard";
import { useTranslations } from "next-intl";
import { PriceComparisonCard } from "./PriceComparisonCard";
import { Currency } from "@/types/priceComparison";

interface HybridStockDisplayProps {
  backendStock?: Stocks;
  apiStock?: ApiStock;
  onBuy?: (symbol: string) => void;
  onSell?: (symbol: string) => void;
  onBuyIPO?: (symbol: string) => void;
}

export function HybridStockDisplay({
  backendStock,
  apiStock,
  onBuy,
  onSell,
  onBuyIPO,
}: HybridStockDisplayProps) {
  const t = useTranslations("components.stocks.hybridDisplay");
  const hasApiData = !!apiStock;


  const displayBackendData = !!backendStock;

  if (!displayBackendData && hasApiData) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-blue-900">
              {apiStock.name} ({apiStock.symbol})
            </h3>
          </div>
          <p className="text-sm text-blue-800">{t("realTimeData")}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ApiPriceChart stock={apiStock} />
        </div>

        <StockCard stock={apiStock} />
      </div>
    );
  }

  if (!backendStock) {
    return null;
  }

  return (
    <div className="space-y-4">
      {hasApiData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-blue-900">
                  {t("marketDataTitle")}
                </h3>
              </div>
              <p className="text-sm text-blue-800">
                {t("marketDataDesc", { exchange: apiStock.exchange })}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <ApiPriceChart stock={apiStock} />
            </div>

            <StockCard stock={apiStock} />
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💰</span>
                <h3 className="font-bold text-green-900">
                  {t("tradingPriceTitle")}
                </h3>
              </div>
              <p className="text-sm text-green-800">{t("tradingPriceDesc")}</p>
            </div>

            <StocksCard
              stock={backendStock}
              onBuy={onBuy}
              onSell={onSell}
              onBuyIPO={onBuyIPO}
            />

          <PriceComparisonCard
            marketPrice={apiStock.price}
            marketCurrency={(apiStock.currency || "USD") as Currency}
            tradingPrice={backendStock.currentPrice}
            tradingCurrency={(backendStock.currency || "EUR") as Currency}
          />
          </div>
        </div>
      ) : (
        <div>
          <StocksCard
            stock={backendStock}
            onBuy={onBuy}
            onSell={onSell}
            onBuyIPO={onBuyIPO}
          />
        </div>
      )}
    </div>
  );
}