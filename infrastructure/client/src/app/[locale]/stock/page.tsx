"use client";

import { HybridStockDisplay } from "@/components/stocks/HybridStockDisplay";
import { PlaceOrderModal } from "@/components/stocks/orders/PlaceOrderModal";
import { PurchaseIPOModal } from "@/components/stocks/orders/PurchaseIPOModal";
import { useMarketData } from "@/hooks/useMarketData";
import { useStocks } from "@/hooks/useStocks";
import { OrderTypeEnum } from "@/types/createOrder";
import { useState } from "react";
import { StockCard } from "@/components/stocks/StockCard";
import { ApiPriceChart } from "@/components/stocks/StockChart";

export default function StocksPage() {
  const { data: backendStocks, isLoading: loadingBackend, error: errorBackend } = useStocks();
  const { data: marketData, isLoading: loadingMarket } = useMarketData();
  const [activeTab, setActiveTab] = useState<"info" | "trading">("trading");

  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
    price: number;
    orderType: OrderTypeEnum;
  } | null>(null);

  const [selectedIPOStock, setSelectedIPOStock] = useState<{
    symbol: string;
    name: string;
    price: number;
    availableShares: number;
  } | null>(null);

  const handleBuy = (symbol: string) => {
    const stock = backendStocks?.find((s) => s.symbol === symbol);
    if (stock) {
      setSelectedStock({
        symbol: stock.symbol,
        name: stock.companyName,
        price: stock.currentPrice,
        orderType: OrderTypeEnum.BUY
      });
    }
  };

  const handleSell = (symbol: string) => {
    const stock = backendStocks?.find((s) => s.symbol === symbol);
    if (stock) {
      setSelectedStock({
        symbol: stock.symbol,
        name: stock.companyName,
        price: stock.currentPrice,
        orderType: OrderTypeEnum.SELL
      });
    }
  };

  const handleBuyIPO = (symbol: string) => {
    const stock = backendStocks?.find((s) => s.symbol === symbol);
    if (stock) {
      setSelectedIPOStock({
        symbol: stock.symbol,
        name: stock.companyName,
        price: stock.currentPrice,
        availableShares: stock.availableSharesForIPO
      });
    }
  };

  if (loadingBackend) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📈 Actions</h1>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Chargement des actions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorBackend) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📈 Actions</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold">Erreur de chargement</p>
            <p className="text-red-600 text-sm mt-2">
              Impossible de charger les actions. Vérifiez que votre backend est démarré.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasMarketData = marketData && marketData.stocks && marketData.stocks.length > 0;
  const hasBackendData = backendStocks && backendStocks.length > 0;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">📈 Actions</h1>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("trading")}
                className={`${
                  activeTab === "trading"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                💰 Actions Disponibles
                {hasBackendData && (
                  <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                    {backendStocks.filter(s => s.isActionAvailable).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={`${
                  activeTab === "info"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                📊 Info Actions (Marché)
                {loadingMarket && (
                  <span className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></span>
                )}
                {hasMarketData && (
                  <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                    {marketData.stocks.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "trading" && (
            <div className="space-y-8">
              {!hasBackendData ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-800 font-semibold">ℹ️ Aucune action disponible</p>
                  <p className="text-blue-600 text-sm mt-2">
                    Aucune action n&apos;est disponible au trading pour le moment.
                  </p>
                </div>
              ) : (
                backendStocks.map((backendStock) => {
                  const apiStock = marketData?.stocks?.find(
                    (api) => api.symbol === backendStock.symbol
                  );

                  return (
                    <div key={backendStock.id}>
                      <HybridStockDisplay
                        backendStock={backendStock}
                        apiStock={apiStock}
                        onBuy={handleBuy}
                        onSell={handleSell}
                        onBuyIPO={handleBuyIPO}
                      />
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "info" && (
            <div className="space-y-6">
              {loadingMarket ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-gray-500 mt-4">Chargement des données de marché...</p>
                </div>
              ) : !hasMarketData ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <p className="text-orange-800 font-semibold">⚠️ Données de marché non disponibles</p>
                  <p className="text-orange-600 text-sm mt-2">
                    Les données de marché en temps réel ne sont pas disponibles pour le moment.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {marketData.stocks.map((apiStock) => (
                    <div key={apiStock.symbol} className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">📊</span>
                          <h3 className="font-bold text-blue-900">
                            {apiStock.name} ({apiStock.symbol})
                          </h3>
                        </div>
                        <p className="text-sm text-blue-800">
                          Données de marché en temps réel - {apiStock.exchange}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <ApiPriceChart stock={apiStock} />
                      </div>

                      <StockCard stock={apiStock} />

                      {!hasBackendData || !backendStocks.find(s => s.symbol === apiStock.symbol) ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">ℹ️</span>
                            <p className="text-sm text-orange-800">
                              Cette action n&apos;est pas encore disponible pour le trading.
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedStock && (
        <PlaceOrderModal
          isOpen={!!selectedStock}
          onClose={() => setSelectedStock(null)}
          stockSymbol={selectedStock.symbol}
          stockName={selectedStock.name}
          currentPrice={selectedStock.price}
          orderType={selectedStock.orderType}
        />
      )}

      {selectedIPOStock && (
        <PurchaseIPOModal
          isOpen={!!selectedIPOStock}
          onClose={() => setSelectedIPOStock(null)}
          stockSymbol={selectedIPOStock.symbol}
          stockName={selectedIPOStock.name}
          ipoPrice={selectedIPOStock.price}
          availableShares={selectedIPOStock.availableShares}
        />
      )}
    </div>
  );
}
