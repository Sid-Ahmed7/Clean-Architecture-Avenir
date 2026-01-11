"use client";

import { useParams } from "next/navigation";
import { useOrderBook } from "@/hooks/useOrderBook";
import { useStocks } from "@/hooks/useStocks";
import { ArrowLeft, Info, RefreshCcw, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function OrderBookPage() {
  const t = useTranslations("stocks.orders.orderBookPage");
  const params = useParams();
  const symbol = params.symbol as string;
  const { data: orderBook, isLoading, error } = useOrderBook(symbol);
  const { data: stocks } = useStocks();

  const stock = stocks?.find(s => s.symbol === symbol.toUpperCase());
  const buyOrders = orderBook?.buyOrders ?? [];
  const sellOrders = orderBook?.sellOrders ?? [];

  const formatCurrency = (value: number, currency = stock?.currency ?? "EUR") =>
    `${value.toFixed(2)}${currency === "EUR" ? "€" : ` ${currency}`}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
            <p className="text-sm text-white/70">{t("title")}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
              <RefreshCcw className="h-6 w-6" />
              {symbol.toUpperCase()}
            </h1>
            <p className="text-sm text-white/70 mt-2">{t("loading")}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 mt-4">{t("loadingBook")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
            <p className="text-sm text-white/70">{t("title")}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
              <RefreshCcw className="h-6 w-6" />
              {symbol.toUpperCase()}
            </h1>
            <p className="text-sm text-white/70 mt-2">{t("loadingError")}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl shadow-sm p-8 text-center">
            <p className="text-red-800 font-semibold">{t("errorMessage")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-white/70">{t("title")}</p>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <RefreshCcw className="h-6 w-6" />
                {symbol.toUpperCase()}
              </h1>
              {stock && (
                <p className="text-sm text-white/80">
                  {stock.companyName} · {formatCurrency(stock.currentPrice, stock.currency)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{t("sales")}</p>
                <p className="text-2xl font-semibold">{sellOrders.length}</p>
                <p className="text-xs text-white/60">{t("orders")}</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{t("purchases")}</p>
                <p className="text-2xl font-semibold">{buyOrders.length}</p>
                <p className="text-xs text-white/60">{t("orders")}</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{t("total")}</p>
                <p className="text-2xl font-semibold">{buyOrders.length + sellOrders.length}</p>
                <p className="text-xs text-white/60">{t("orders")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/manage-stock/order-book" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> {t("back")}
              </Link>
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{t("liveBook")}</p>
                <p className="text-sm text-slate-600">{t("liveDescription")}</p>
              </div>
            </div>
            {stock && (
              <div className="text-right">
                <p className="text-xs text-slate-500">{t("lastPrice")}</p>
                <p className="text-xl font-semibold text-slate-900">{formatCurrency(stock.currentPrice, stock.currency)}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-red-700">
                    {t("sellOrders")} ({sellOrders.length})
                  </h2>
                </div>
              </div>

              {sellOrders.length > 0 ? (
                <div className="space-y-2">
                  {sellOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                    >
                      <div>
                        <p className="font-semibold text-red-700">
                          {formatCurrency(order.price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.quantity} {t("shares")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{t("totalLabel")}</p>
                        <p className="text-sm font-semibold text-red-800">
                          {formatCurrency(order.price * order.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6 bg-red-50 border border-red-100 rounded-xl">
                  {t("noSellOrders")}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-green-700">
                    {t("buyOrders")} ({buyOrders.length})
                  </h2>
                </div>
              </div>

              {buyOrders.length > 0 ? (
                <div className="space-y-2">
                  {buyOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                    >
                      <div>
                        <p className="font-semibold text-green-700">
                          {formatCurrency(order.price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.quantity} {t("shares")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{t("totalLabel")}</p>
                        <p className="text-sm font-semibold text-green-800">
                          {formatCurrency(order.price * order.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6 bg-green-50 border border-green-100 rounded-xl">
                  {t("noBuyOrders")}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              💡
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>{t("howItWorks")}</strong> {t("howItWorksDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
