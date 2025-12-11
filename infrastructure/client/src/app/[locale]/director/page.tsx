"use client";

import { useStocks } from "@/hooks/useStocks";
import { useOrderBook } from "@/hooks/useStocksOrder";
import { useUserTransactions } from "@/hooks/useStockTransactions";
import { Order } from "@/types/order";
import { Transaction, UserTransaction } from "@/types/transaction";
import { useMemo } from "react";

export default function AdminDashboardPage() {
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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-2">Actions totales</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalStocks}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-2">Actions disponibles</p>
          <p className="text-3xl font-bold text-green-600">{stats.availableStocks}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-2">Ordres en attente</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-2">Transactions totales</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTransactions}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Volume total des transactions</h2>
        <p className="text-4xl font-bold text-gray-900">{stats.totalVolume.toFixed(2)}€</p>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actions récentes</h2>
        <div className="space-y-4">
          {stocks?.slice(0, 5).map((stock) => (
            <div key={stock.id} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-semibold text-gray-900">{stock.symbol}</p>
                <p className="text-sm text-gray-500">{stock.companyName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{stock.currentPrice.toFixed(2)}€</p>
                <p className={`text-sm ${stock.isActionAvailable ? "text-green-600" : "text-red-600"}`}>
                  {stock.isActionAvailable ? "Disponible" : "Indisponible"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}