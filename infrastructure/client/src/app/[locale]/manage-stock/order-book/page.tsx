"use client";

import { useState } from "react";
import { DirectorOrderList } from "@/components/stocks/orders/DirectorOrderList";
import { DirectorOrderFilters } from "@/components/stocks/orders/DirectorOrderFilters";
import { useAllOrders } from "@/hooks/useStocksOrder";
import { OrderStatusEnum } from "@/types/order";

export default function DirectorOrdersPage() {
  const { data: orders, isLoading, error } = useAllOrders();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusEnum | "ALL">("ALL");

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Gestion des ordres
          </h1>
          <p className="text-center text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Gestion des ordres
          </h1>
          <p className="text-center text-red-500">
            Erreur lors du chargement des ordres
          </p>
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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Suivi des ordres
          </h1>
          <p className="text-gray-600">
            Visualisez tous les ordres d&apos;achat et de vente..
          </p>

          {orders && orders.length > 0 && (
            <div className="mt-4 flex gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-blue-600 font-semibold">
                  Total: {filteredOrders.length} ordre{filteredOrders.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-green-600 font-semibold">
                  {filteredOrders.filter(o => o.orderType === "BUY").length} Achat
                </span>
              </div>
              <div className="bg-red-50 px-4 py-2 rounded-lg">
                <span className="text-sm text-red-600 font-semibold">
                  {filteredOrders.filter(o => o.orderType === "SELL").length} Vente
                </span>
              </div>
            </div>
          )}
        </div>

        <DirectorOrderFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          orderCounts={orderCounts}
        />

        <DirectorOrderList orders={filteredOrders} />
      </div>
    </div>
  );
}
