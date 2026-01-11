"use client";

import { OrderList } from "@/components/stocks/orders/OrderList";
import { useCancelOrder, useOrderBook } from "@/hooks/useStocksOrder";
import { useTranslations } from "next-intl";
import { ClipboardList, Loader2, XCircle } from "lucide-react";
import { useNotification } from "@/hooks/useNotifications";
import { NotificationEnum } from "@/types/Notification";

export default function OrdersPage() {
  const t = useTranslations('pages.orders');
  const { addNotification } = useNotification();
  const { data: orders, isLoading, error } = useOrderBook();
  const cancelOrderMutation = useCancelOrder();

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrderMutation.mutateAsync(orderId);
    } catch (err) {
      addNotification(NotificationEnum.ALERT, t('cancelError'));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
            <p className="text-sm text-white/70">{t('title')}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              {t('title')}
            </h1>
            <p className="text-sm text-white/70 mt-2">{t('loading')}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
            <p className="text-slate-600 mt-4">{t('loading')}</p>
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
            <p className="text-sm text-white/70">{t('title')}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              {t('title')}
            </h1>
            <p className="text-sm text-white/70 mt-2">{t('errorMessage')}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl shadow-sm p-8 text-center">
            <XCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
            <p className="text-red-800 font-semibold">{t('errorMessage')}</p>
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
              <p className="text-sm text-white/70">{t('title')}</p>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <ClipboardList className="h-6 w-6" />
                {t('title')}
              </h1>
              <p className="text-sm text-white/80">Vos ordres en cours et leur statut.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-wide text-white/70">Total</p>
              <p className="text-2xl font-semibold">{orders?.length ?? 0}</p>
              <p className="text-xs text-white/60">ordres</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <OrderList
            orders={orders || []}
            onCancel={handleCancelOrder}
            isLoading={cancelOrderMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}