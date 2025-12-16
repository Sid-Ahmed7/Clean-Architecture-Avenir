"use client";

import { useStocks } from "@/hooks/useStocks";
import { useOrderBook } from "@/hooks/useStocksOrder";
import { useUserTransactions } from "@/hooks/useStockTransactions";
import { Link } from "@/i18n/navigation";
import { Order } from "@/types/order";
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="flex gap-3">
          <Link
            href="/manage-stock/stocks"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Gérer les actions
          </Link>
          <Link
            href="/manage-stock/order-book"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Carnet d&apos;ordres
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/manage-stock/stocks" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <p className="text-sm text-gray-500 mb-2">Actions totales</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalStocks}</p>
        </Link>

        <Link href="/manage-stock/stocks" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <p className="text-sm text-gray-500 mb-2">Actions disponibles</p>
          <p className="text-3xl font-bold text-green-600">{stats.availableStocks}</p>
        </Link>

        <Link href="/manage-stock/order-book" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <p className="text-sm text-gray-500 mb-2">Ordres en attente</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-500 mb-2">Transactions totales</p>
          <p className="text-3xl font-bold text-blue-600">{stats.totalTransactions}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Volume total des transactions</h2>
        <p className="text-4xl font-bold text-gray-900">{stats.totalVolume.toFixed(2)}€</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Actions rapides</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/manage-stock/stocks"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-900 font-medium">Gérer les actions</span>
              <span className="text-blue-600">→</span>
            </Link>
            <Link
              href="/manage-stock/order-book"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-900 font-medium">Voir le carnet d&apos;ordres</span>
              <span className="text-purple-600">→</span>
            </Link>
            <Link
              href="/stock"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-900 font-medium">Place de marché</span>
              <span className="text-green-600">→</span>
            </Link>
            <Link
              href="/position"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-900 font-medium">Mes positions</span>
              <span className="text-orange-600">→</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Actions récentes</h2>
            <Link href="/manage-stock/stocks" className="text-sm text-blue-600 hover:text-blue-700">
              Voir tout
            </Link>
          </div>
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
    </div>
  );
}