"use client";

import { Stocks } from "@/types/stocks";
import { Stock as ApiStock } from "@/types/stock";
import { StockCard } from "./StockCard";
import { ApiPriceChart } from "./StockChart";
import { StocksCard } from "./StocksCard";
import { useTranslations } from "next-intl";

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

  // Ensure backendStock is defined if we reach the point where we need it
  // This simplifies TS checks later
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">⚖️</span>
                <h4 className="font-semibold text-yellow-900">
                  {t("comparison")}
                </h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-700">{t("marketPrice")}</span>
                  <span className="font-bold text-yellow-900">
                    ${apiStock.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">{t("tradingPrice")}</span>
                  <span className="font-bold text-yellow-900">
                    {backendStock.currentPrice.toFixed(2)}{" "}
                    {backendStock.currency}
                  </span>
                </div>
                <div className="flex justify-between border-t border-yellow-300 pt-2">
                  <span className="text-yellow-700 font-semibold">
                    {t("gap")}
                  </span>
                  <span className="font-bold text-yellow-900">
                    {(
                      ((backendStock.currentPrice - apiStock.price) /
                        apiStock.price) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>{t("important")}</strong>{" "}
                {t.rich("importantDesc", {
                  gap: ((
                    ((backendStock.currentPrice - apiStock.price) / apiStock.price) * 100
                  ).toFixed(2)),
                  bold: (chunks) => <strong>{chunks}</strong>
                })}
              </p>
            </div>
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