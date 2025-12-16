"use client";

import { Stocks } from "@/types/stocks";
import { Stock as ApiStock } from "@/types/stock";
import { StockCard } from "./StockCard";
import { ApiPriceChart } from "./StockChart";
import { StocksCard } from "./StocksCard";

interface HybridStockDisplayProps {
  backendStock?: Stocks;
  apiStock?: ApiStock;
  onBuy?: (symbol: string) => void;
  onSell?: (symbol: string) => void;
  onBuyIPO?: (symbol: string) => void;
}

export function HybridStockDisplay({backendStock,apiStock,onBuy,onSell,onBuyIPO}: HybridStockDisplayProps) {
  const hasApiData = !!apiStock;
  const hasBackendData = !!backendStock;

  if (!hasBackendData && hasApiData) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-blue-900">
              {apiStock.name} ({apiStock.symbol})
            </h3>
          </div>
          <p className="text-sm text-blue-800">
            Données de marché en temps réel
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ApiPriceChart stock={apiStock} />
        </div>

        <StockCard stock={apiStock} />
      </div>
    );
  }

  if (!hasBackendData) {
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
                  Données de marché réel
                </h3>
              </div>
              <p className="text-sm text-blue-800">
                Prix et graphique en temps réel depuis {apiStock.exchange}
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
                  Prix de trading
                </h3>
              </div>
              <p className="text-sm text-green-800">
                Prix calculé depuis notre carnet d&apos;ordres
              </p>
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
                <h4 className="font-semibold text-yellow-900">Comparaison</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Prix marché :</span>
                  <span className="font-bold text-yellow-900">
                    ${apiStock.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Prix trading :</span>
                  <span className="font-bold text-yellow-900">
                    {backendStock.currentPrice.toFixed(2)} {backendStock.currency}
                  </span>
                </div>
                <div className="flex justify-between border-t border-yellow-300 pt-2">
                  <span className="text-yellow-700 font-semibold">Écart :</span>
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
                <strong>Important :</strong> Vos transactions s&apos;effectuent au{" "}
                <strong>prix de trading</strong> ({backendStock.currentPrice.toFixed(2)}{" "}
                {backendStock.currency}), pas au prix du marché.
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