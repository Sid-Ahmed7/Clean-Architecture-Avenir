"use client";

import { Stocks } from "@/types/stocks";

interface StocksCardProps {
  stock: Stocks;
  onBuy?: (symbol: string) => void;
  onSell?: (symbol: string) => void;
}

export function StocksCard({ stock, onBuy, onSell }: StocksCardProps) {
  const isPositive = stock.rateOfChange >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{stock.symbol}</h3>
          <p className="text-sm text-gray-600 truncate">{stock.companyName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
              {stock.currency}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                stock.isActionAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {stock.isActionAvailable ? "🟢 Disponible" : "⚫ Indisponible"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">
          {stock.currentPrice.toFixed(2)} {stock.currency}
        </div>

        <div className="flex items-center mt-2">
          <span
            className={`text-sm font-semibold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "↑" : "↓"}{" "}
            {stock.previousPrice
              ? Math.abs(stock.currentPrice - stock.previousPrice).toFixed(2)
              : "0.00"}{" "}
            {stock.currency}
          </span>
          <span
            className={`ml-2 text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            ({isPositive ? "+" : ""}
            {stock.rateOfChange.toFixed(2)}%)
          </span>
        </div>
      </div>

      {stock.previousPrice && (
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Prix précédent</div>
            <div className="font-semibold text-gray-900">
              {stock.previousPrice.toFixed(2)} {stock.currency}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Variation</div>
            <div
              className={`font-semibold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {stock.rateOfChange.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {stock.isActionAvailable && (
        <div>
          <div className="flex gap-2">
            {onBuy && (
              <button
                onClick={() => onBuy(stock.symbol)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Acheter à {stock.currentPrice.toFixed(2)}€
              </button>
            )}
            {onSell && (
              <button
                onClick={() => onSell(stock.symbol)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Vendre
              </button>
            )}
          </div>

          <div className="mt-3 text-xs text-center text-gray-500">
            Mis à jour : {new Date(stock.updatedAt).toLocaleString("fr-FR")}
          </div>
        </div>
      )}

      {!stock.isActionAvailable && (
        <div className="text-center text-sm text-gray-500 py-2 bg-gray-100 rounded">
          Cette action n'est pas disponible au trading
        </div>
      )}
    </div>
  );
}