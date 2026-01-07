"use client";

import { OrderList } from "@/components/stocks/orders/OrderList";
import { useCancelOrder, useOrderBook } from "@/hooks/useStocksOrder";


import { useTranslations } from "next-intl";

export default function OrdersPage() {
  const t = useTranslations('pages.orders');
  const { data: orders, isLoading, error } = useOrderBook();
  const cancelOrderMutation = useCancelOrder();

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrderMutation.mutateAsync(orderId);
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(t('cancelError'));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <p className="text-center text-gray-500">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <p className="text-center text-red-500">
            {t('errorMessage')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('title')}</h1>
        <OrderList
          orders={orders || []}
          onCancel={handleCancelOrder}
          isLoading={cancelOrderMutation.isPending}
        />
      </div>
    </div>
  );
}