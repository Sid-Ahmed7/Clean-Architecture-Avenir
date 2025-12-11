"use client";

import { HybridStockDisplay } from "@/components/stocks/HybridStockDisplay";
import { PlaceOrderModal } from "@/components/stocks/orders/PlaceOrderModal";
import { useMarketData } from "@/hooks/useMarketData";
import { useStocks } from "@/hooks/useStocks";
import { OrderTypeEnum } from "@/types/createOrder";
import { useState } from "react";
import { Stocks } from "@/types/stocks";

export default function StocksPage() {
  const { data: backendStocks, isLoading: loadingBackend, error: errorBackend } = useStocks();
  
  const { data: marketData, isLoading: loadingMarket } = useMarketData();

  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
    price: number;
    orderType: OrderTypeEnum;
  } | null>(null);

  const handleBuy = (symbol: string) => {
    console.log("handleBuy called with:", symbol);
    const stock = backendStocks?.find((s) => s.symbol === symbol);
    console.log("Found stock:", stock);
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
    console.log("handleSell called with:", symbol);
    const stock = backendStocks?.find((s) => s.symbol === symbol);
    console.log(" Found stock:", stock);
    if (stock) {
      setSelectedStock({
        symbol: stock.symbol,
        name: stock.companyName,
        price: stock.currentPrice,
        orderType: OrderTypeEnum.SELL
      });
    }
  };



  if (loadingBackend) {
    console.log("Rendering LOADING screen");
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📈 Actions disponibles</h1>
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Chargement des actions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorBackend) {
    console.log(" ERROR:", errorBackend);
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📈 Actions disponibles</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold">Erreur de chargement</p>
            <p className="text-red-600 text-sm mt-2">
              Impossible de charger les actions. Vérifiez que votre backend est démarré sur{" "}
              <code className="bg-red-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}
              </code>
            </p>
            <details className="mt-4">
              <summary className="cursor-pointer text-red-700 font-semibold">
                Détails de l'erreur
              </summary>
              <pre className="mt-2 bg-red-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(errorBackend, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    );
  }

  const hasMarketData = marketData && marketData.stocks && marketData.stocks.length > 0;
  const hasBackendData = backendStocks && backendStocks.length > 0;

  if (!hasBackendData && !hasMarketData && !loadingMarket) {
    console.log(" NO DATA");
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📈 Actions disponibles</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-blue-800 font-semibold">ℹ️ Aucune action disponible</p>
            <p className="text-blue-600 text-sm mt-2">
              Aucune donnée de marché disponible pour le moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log("✅ Rendering MAIN screen with stocks");

  const stocksToDisplay = hasBackendData ? backendStocks : (marketData?.stocks || []);
  const displayMode = hasBackendData ? 'hybrid' : 'market-only';

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📈 Actions disponibles</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {stocksToDisplay.length} action(s) disponible(s)
            </span>
            {loadingMarket && (
              <span className="text-xs text-blue-600 flex items-center gap-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                Chargement données marché...
              </span>
            )}
            {marketData && (
              <span className="text-xs text-green-600">
                ✓ Données marché chargées ({marketData.stocks?.length || 0} actions)
              </span>
            )}
            {!hasBackendData && hasMarketData && (
              <span className="text-xs text-orange-600">
                ⚠️ Mode marché uniquement (pas d&apos;actions backend)
              </span>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {displayMode === 'hybrid' && backendStocks ? (
            backendStocks.map((backendStock, index) => {
              console.log(`🔍 Rendering stock ${index}:`, backendStock.symbol);

              const apiStock = marketData?.stocks?.find(
                (api) => api.symbol === backendStock.symbol
              );

              console.log(`🔍 API stock for ${backendStock.symbol}:`, apiStock ? "FOUND" : "NOT FOUND");

              return (
                <div key={backendStock.id}>
                  <HybridStockDisplay
                    backendStock={backendStock}
                    apiStock={apiStock}
                    onBuy={handleBuy}
                    onSell={handleSell}
                  />
                </div>
              );
            })
          ) : (
            // Mode market-only: afficher uniquement les données de marché
            marketData?.stocks?.map((apiStock, index) => {
              console.log(`🔍 Rendering market stock ${index}:`, apiStock.symbol);

              return (
                <div key={apiStock.symbol}>
                  <HybridStockDisplay
                    backendStock={undefined}
                    apiStock={apiStock}
                    onBuy={undefined}
                    onSell={undefined}
                  />
                </div>
              );
            })
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
    </div>
  );
}