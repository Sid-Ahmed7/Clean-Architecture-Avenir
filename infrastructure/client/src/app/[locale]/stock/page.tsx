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
import { useTranslations } from "next-intl";

export default function StocksPage() {
  const t = useTranslations("pages.stock");
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl border border-slate-800/40 p-8">
            <p className="text-sm text-white/70">{t("tabs.trading")} · {t("tabs.info")}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">📈 {t("title")}</h1>
            <p className="text-sm text-white/70 mt-2">{t("loading")}</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorBackend) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl border border-slate-800/40 p-8">
            <p className="text-sm text-white/70">{t("tabs.trading")} · {t("tabs.info")}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">📈 {t("title")}</h1>
            <p className="text-sm text-white/70 mt-2">{t("errorTitle")}</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
            <p className="text-red-800 font-semibold">{t("errorTitle")}</p>
            <p className="text-red-600 text-sm mt-2">
              {t("errorMessage")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasMarketData = marketData && marketData.stocks && marketData.stocks.length > 0;
  const hasBackendData = backendStocks && backendStocks.length > 0;
  const tradableCount = backendStocks?.filter((s) => s.isActionAvailable).length ?? 0;
  const ipoCount = backendStocks?.filter((s) => s.availableSharesForIPO > 0).length ?? 0;
  const marketCount = marketData?.stocks?.length ?? 0;
  const primaryExchange = hasMarketData ? marketData.stocks[0].exchange : "—";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl border border-slate-800/40 p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-white/70">{t("tabs.trading")} · {t("tabs.info")}</p>
              <h1 className="text-3xl font-bold flex items-center gap-2">📈 {t("title")}</h1>
              <p className="text-sm text-white/80">
                {hasMarketData ? t("marketData.realtime", { exchange: primaryExchange }) : t("loading")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{t("tabs.trading")}</p>
                <p className="text-2xl font-semibold">{tradableCount}</p>
                <p className="text-xs text-white/60">{t("tabs.trading")}</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">IPO</p>
                <p className="text-2xl font-semibold">{ipoCount}</p>
                <p className="text-xs text-white/60">IPO</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{t("tabs.info")}</p>
                <p className="text-2xl font-semibold">{marketCount}</p>
                <p className="text-xs text-white/60">{t("tabs.info")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <div className="flex flex-col gap-4 px-6 pt-6 pb-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg shadow-inner">📊</span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{t("tabs.trading")} · {t("tabs.info")}</p>
                  <p className="text-sm text-slate-600">{hasMarketData ? t("marketData.realtime", { exchange: primaryExchange }) : t("marketData.loading")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${hasMarketData ? "bg-emerald-500" : "bg-amber-400"} animate-pulse`}></span>
                <p className="text-xs text-slate-500">
                  {hasMarketData ? t("tabs.info") : t("marketData.loading")}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <nav className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("trading")}
                  className={`${activeTab === "trading"
                    ? "bg-white text-blue-700 border border-blue-200 shadow-sm"
                    : "text-slate-600 hover:text-slate-800 border border-transparent"
                    } px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                >
                  💰 {t("tabs.trading")}
                  {hasBackendData && (
                    <span className="ml-2 bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">
                      {tradableCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("info")}
                  className={`${activeTab === "info"
                    ? "bg-white text-blue-700 border border-blue-200 shadow-sm"
                    : "text-slate-600 hover:text-slate-800 border border-transparent"
                    } px-4 py-2 rounded-lg text-sm font-medium transition-all`}
                >
                  📊 {t("tabs.info")}
                  {loadingMarket && (
                    <span className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></span>
                  )}
                  {hasMarketData && (
                    <span className="ml-2 bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs">
                      {marketCount}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          <div className="p-6 bg-white">
            {activeTab === "trading" && (
              <div className="space-y-8">
                {!hasBackendData ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <p className="text-blue-900 font-semibold">ℹ️ {t("noActions.title")}</p>
                    <p className="text-blue-700 text-sm mt-2">
                      {t("noActions.description")}
                    </p>
                  </div>
                ) : (
                  backendStocks.map((backendStock) => {
                    const apiStock = marketData?.stocks?.find(
                      (api) => api.symbol === backendStock.symbol
                    );

                    return (
                      <div key={backendStock.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
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
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 mt-4">{t("marketData.loading")}</p>
                  </div>
                ) : !hasMarketData ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <p className="text-orange-800 font-semibold">⚠️ {t("marketData.unavailableTitle")}</p>
                    <p className="text-orange-700 text-sm mt-2">
                      {t("marketData.unavailableDesc")}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {marketData.stocks.map((apiStock) => (
                      <div key={apiStock.symbol} className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">📊</span>
                            <h3 className="font-bold text-blue-900">
                              {apiStock.name} ({apiStock.symbol})
                            </h3>
                          </div>
                          <p className="text-sm text-blue-800">
                            {t("marketData.realtime", { exchange: apiStock.exchange })}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-6">
                          <ApiPriceChart stock={apiStock} />
                        </div>

                        <StockCard stock={apiStock} />

                        {!hasBackendData || !backendStocks.find(s => s.symbol === apiStock.symbol) ? (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">ℹ️</span>
                              <p className="text-sm text-orange-800">
                                {t("marketData.notTradable")}
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
