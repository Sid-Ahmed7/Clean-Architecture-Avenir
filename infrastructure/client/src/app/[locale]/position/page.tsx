"use client";

import { useUserPositions } from "@/hooks/usePositions";
import { useState } from "react";
import { OrderTypeEnum } from "@/types/createOrder";
import { PositionList } from "@/components/stocks/positions/PositionList";
import { PlaceOrderModal } from "@/components/stocks/orders/PlaceOrderModal";

export default function PortfolioPage() {
  const { data: positions, isLoading, error } = useUserPositions();
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
    price: number;
  } | null>(null);

  const handleSell = (symbol: string) => {
    const position = positions?.find((p) => p.stockSymbol === symbol);
    if (position) {
      setSelectedStock({
        symbol: position.stockSymbol,
        name:  position.stockSymbol,
        price: position.averagePrice
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon portefeuille</h1>
          <p className="text-center text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon portefeuille</h1>
          <p className="text-center text-red-500">
            Erreur lors du chargement du portefeuille
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mon portefeuille</h1>
        <PositionList positions={positions || []} onSell={handleSell} />
      </div>

      {selectedStock && (
        <PlaceOrderModal
          isOpen={!!selectedStock}
          onClose={() => setSelectedStock(null)}
          stockSymbol={selectedStock.symbol}
          stockName={selectedStock.name}
          currentPrice={selectedStock.price}
          orderType={OrderTypeEnum.SELL}
        />
      )}
    </div>
  );
}