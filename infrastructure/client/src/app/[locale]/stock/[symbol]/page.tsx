"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Stock } from "@/types/stock";
import { StockCard } from "@/components/stocks/StockCard";
import { OrderTypeEnum } from "@/types/createOrder";
import { usePositionBySymbol } from "@/hooks/usePositions";
import { useTransactionsBySymbol } from "@/hooks/useStockTransactions";
import { PositionCard } from "@/components/stocks/positions/PositionCard";
import { TransactionCard } from "@/components/stocks/transactions/TransactionCard";
import { PlaceOrderModal } from "@/components/stocks/orders/PlaceOrderModal";

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<{
    orderType: OrderTypeEnum;
  } | null>(null);

  const { data: transactions } = useTransactionsBySymbol(symbol);
  const { data: position } = usePositionBySymbol(symbol);

  useEffect(() => {
    async function fetchStock() {
      try {
        const res = await fetch(`/api/stocks/${symbol}`);
        const data = await res.json();

        if (res.ok && data.stocks && data.stocks.length > 0) {
          setStock(data.stocks[0]);
        } else {
          setError(data.error || "Stock not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch stock");
      } finally {
        setLoading(false);
      }
    }

    if (symbol) {
      fetchStock();
    }
  }, [symbol]);

  if (loading) return <p className="p-6 text-center">Chargement...</p>;
  if (error || !stock) return <p className="p-6 text-center text-red-500">{error || "Action introuvable"}</p>;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{stock.symbol}</h1>
          <p className="text-gray-600">{stock.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <StockCard
              stock={stock}
              onBuy={() => setSelectedOrder({ orderType: OrderTypeEnum.BUY })}
              onSell={() => setSelectedOrder({ orderType: OrderTypeEnum.SELL })}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {position && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ma position</h2>
                <PositionCard
                  position={position}
                  onSell={() => setSelectedOrder({ orderType: OrderTypeEnum.SELL })}
                />
              </div>
            )}

            {transactions && transactions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Historique des transactions
                </h2>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <PlaceOrderModal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          stockSymbol={stock.symbol}
          stockName={stock.name}
          currentPrice={stock.price}
          orderType={selectedOrder.orderType}
        />
      )}
    </div>
  );
}