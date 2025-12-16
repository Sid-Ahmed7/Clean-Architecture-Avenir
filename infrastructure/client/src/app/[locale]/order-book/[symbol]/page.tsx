"use client";

import { useParams } from "next/navigation";
import { useOrderBook } from "@/hooks/useOrderBook";
import { useStocks } from "@/hooks/useStocks";

export default function OrderBookPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { data: orderBook, isLoading, error } = useOrderBook(symbol);
  const { data: stocks } = useStocks();

  const stock = stocks?.find(s => s.symbol === symbol.toUpperCase());

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Carnet d&apos;ordres - {symbol}
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
            Carnet d&apos;ordres - {symbol}
          </h1>
          <p className="text-center text-red-500">
            Erreur lors du chargement du carnet d&apos;ordres
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Carnet d&apos;ordres - {symbol}
          </h1>
          {stock && (
            <div className="flex items-center gap-4">
              <p className="text-gray-600">{stock.companyName}</p>
              <span className="text-2xl font-bold text-blue-600">
                {stock.currentPrice.toFixed(2)}€
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-4">
                📉 Ordres de VENTE ({orderBook?.sellOrders.length || 0})
              </h2>
              {orderBook && orderBook.sellOrders.length > 0 ? (
                <div className="space-y-2">
                  {orderBook.sellOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div>
                        <p className="font-semibold text-red-700">
                          {order.price.toFixed(2)}€
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.quantity} actions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Total: {(order.price * order.quantity).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucun ordre de vente
                </p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-green-600 mb-4">
                📈 Ordres d&apos;ACHAT ({orderBook?.buyOrders.length || 0})
              </h2>
              {orderBook && orderBook.buyOrders.length > 0 ? (
                <div className="space-y-2">
                  {orderBook.buyOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        <p className="font-semibold text-green-700">
                          {order.price.toFixed(2)}€
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.quantity} actions
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          Total: {(order.price * order.quantity).toFixed(2)}€
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Aucun ordre d&apos;achat
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Comment ça marche ?</strong> Les ordres sont automatiquement matchés
              lorsqu&apos;un prix d&apos;achat est supérieur ou égal à un prix de vente.
              Le prix d&apos;exécution est la moyenne des deux prix.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
