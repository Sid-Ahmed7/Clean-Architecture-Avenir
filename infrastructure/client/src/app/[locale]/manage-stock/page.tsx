"use client";

import { useStocks } from "@/hooks/useStocks";
import { useOrderBook } from "@/hooks/useStocksOrder";
import { useUserTransactions } from "@/hooks/useStockTransactions";
import { Link } from "@/i18n/navigation";
import { Order } from "@/types/order";
import { useMemo } from "react";
import { ArrowRight, BarChart3, Building2, ClipboardList, LayoutDashboard, ShieldCheck, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminDashboardPage() {
  const t = useTranslations("pages.manageStock.dashboard");
  const { data: stocks } = useStocks();
  const { data: orders } = useOrderBook();
  const { data: transactions } = useUserTransactions();

  const stats = useMemo(() => {
    const totalStocks = stocks?.length || 0;
    const availableStocks = stocks?.filter((s) => s.isActionAvailable).length || 0;
    const pendingOrders = orders?.filter((o: Order) => o.status === "PENDING").length || 0;
    const totalTransactions = transactions?.length || 0;
    const totalVolume = transactions?.reduce<number>((sum, t) => sum + (t.executionPrice * t.quantity), 0) || 0;

    return {
      totalStocks,
      availableStocks,
      pendingOrders,
      totalTransactions,
      totalVolume
    };
  }, [stocks, orders, transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/50 p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-white/70">{t("subtitle")}</p>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <LayoutDashboard className="h-6 w-6" />
                {t("title")}
              </h1>
              <p className="text-sm text-white/80">{t("description")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/manage-stock/stocks"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-800 font-semibold shadow-sm hover:-translate-y-0.5 transition"
              >
                <Building2 className="h-4 w-4" />
                {t("buttons.manageStocks")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/manage-stock/order-book"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100/20 text-white border border-white/20 font-semibold hover:-translate-y-0.5 transition"
              >
                <ClipboardList className="h-4 w-4" />
                {t("buttons.orderBook")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/manage-stock/stocks"
            className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t("cards.totalStocks")}</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalStocks}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
            </div>
          </Link>

          <Link
            href="/manage-stock/stocks"
            className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t("cards.availableStocks")}</p>
                  <p className="text-3xl font-bold text-emerald-700">{stats.availableStocks}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
            </div>
          </Link>

          <Link
            href="/manage-stock/order-book"
            className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t("cards.pendingOrders")}</p>
                  <p className="text-3xl font-bold text-amber-700">{stats.pendingOrders}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600" />
            </div>
          </Link>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{t("cards.totalTransactions")}</p>
                <p className="text-3xl font-bold text-indigo-700">{stats.totalTransactions}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">{t("cards.transactionsDesc")}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">{t("performance.label")}</p>
              <h2 className="text-xl font-bold text-slate-900">{t("performance.totalVolume")}</h2>
            </div>
          </div>
          <p className="text-4xl font-bold text-slate-900">{stats.totalVolume.toFixed(2)}€</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">{t("quickActions.title")}</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/manage-stock/stocks"
                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-slate-900 font-medium">{t("quickActions.manageStocks")}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-600" />
              </Link>
              <Link
                href="/manage-stock/order-book"
                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-purple-600" />
                  <span className="text-slate-900 font-medium">{t("quickActions.viewOrderBook")}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-600" />
              </Link>
              <Link
                href="/stock"
                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                  <span className="text-slate-900 font-medium">{t("quickActions.marketplace")}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-600" />
              </Link>
              <Link
                href="/position"
                className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-orange-600" />
                  <span className="text-slate-900 font-medium">{t("quickActions.myPositions")}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-orange-600" />
              </Link>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">{t("recentStocks.title")}</h2>
              <Link href="/manage-stock/stocks" className="text-sm text-blue-600 hover:text-blue-700">
                {t("recentStocks.viewAll")}
              </Link>
            </div>
            <div className="space-y-4">
              {stocks?.slice(0, 5).map((stock) => (
                <div key={stock.id} className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <p className="font-semibold text-slate-900">{stock.symbol}</p>
                    <p className="text-sm text-slate-500">{stock.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{stock.currentPrice.toFixed(2)}€</p>
                    <p className={`text-sm ${stock.isActionAvailable ? "text-emerald-600" : "text-red-600"}`}>
                      {stock.isActionAvailable ? t("recentStocks.available") : t("recentStocks.unavailable")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}