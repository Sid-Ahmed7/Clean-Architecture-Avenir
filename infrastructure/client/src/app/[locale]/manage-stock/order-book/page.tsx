"use client";

import { useState } from "react";
import { DirectorOrderList } from "@/components/stocks/orders/DirectorOrderList";
import { DirectorOrderFilters } from "@/components/stocks/orders/DirectorOrderFilters";
import { useAllOrders } from "@/hooks/useStocksOrder";
import { OrderStatusEnum } from "@/types/order";
import { BarChart3, ClipboardList, Loader2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DirectorOrdersPage() {
  const t = useTranslations("pages.manageStock.orderBook");
  const { data: orders, isLoading, error } = useAllOrders();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusEnum | "ALL">("ALL");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
            <p className="text-sm text-white/70">{t("subtitle")}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              {t("title")}
            </h1>
            <p className="text-sm text-white/70 mt-2">{t("loadingData")}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
            <p className="text-slate-600 mt-4">{t("loading")}</p>
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
            <p className="text-sm text-white/70">{t("subtitle")}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              {t("title")}
            </h1>
            <p className="text-sm text-white/70 mt-2">{t("loadingError")}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl shadow-sm p-8 text-center">
            <XCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
            <p className="text-red-800 font-semibold">{t("errorLoadingOrders")}</p>
          </div>
        </div>
      </div>
    );
  }

  const orderCounts = {
    all: orders?.length || 0,
    pending: orders?.filter(o => o.status === OrderStatusEnum.PENDING).length || 0,
    executed: orders?.filter(o => o.status === OrderStatusEnum.EXECUTED).length || 0,
    partiallyExecuted: orders?.filter(o => o.status === OrderStatusEnum.PARTIALLY_EXECUTED).length || 0,
    cancelled: orders?.filter(o => o.status === OrderStatusEnum.CANCELLED).length || 0,
    rejected: orders?.filter(o => o.status === OrderStatusEnum.REJECTED).length || 0,
  };

  const filteredOrders = selectedStatus === "ALL"
    ? orders || []
    : orders?.filter(o => o.status === selectedStatus) || [];

  const totalFiltered = filteredOrders.length;
  const totalBuy = filteredOrders.filter(o => o.orderType === "BUY").length;
  const totalSell = filteredOrders.filter(o => o.orderType === "SELL").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-white/70">{t("subtitle")}</p>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <ClipboardList className="h-6 w-6" />
                {t("title")}
              </h1>
              <p className="text-sm text-white/80">{t("description")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{t("stats.total")}</p>
                <p className="text-2xl font-semibold">{totalFiltered}</p>
                <p className="text-xs text-white/60">{t("stats.orders", { count: totalFiltered })}</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{t("stats.buy")}</p>
                <p className="text-2xl font-semibold">{totalBuy}</p>
                <p className="text-xs text-white/60">BUY</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{t("stats.sell")}</p>
                <p className="text-2xl font-semibold">{totalSell}</p>
                <p className="text-xs text-white/60">SELL</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{t("filters.title")}</p>
                <p className="text-sm text-slate-600">{t("filters.description")}</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              {t("filters.totalOrders", { count: orders?.length ?? 0 })}
            </div>
          </div>

          <DirectorOrderFilters
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            orderCounts={orderCounts}
          />

          <DirectorOrderList orders={filteredOrders} />
        </div>
      </div>
    </div>
  );
}
