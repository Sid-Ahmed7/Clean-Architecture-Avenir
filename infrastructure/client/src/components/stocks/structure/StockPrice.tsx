import { ExtendHours } from "@/types/stock";

interface StockPriceProps {
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  extendedHours?: ExtendHours
  isMarketOpen: boolean;
}

export function StockPrice({price, currency,change,changePercent, extendedHours,isMarketOpen}: StockPriceProps) {
    return (
    <div className="mb-4">
      <div className="text-3xl font-bold text-gray-900">
        ${price.toFixed(2)}
        <span className="text-sm text-gray-500 ml-2">
          {currency}
        </span>
      </div>
      
      <div className="flex items-center mt-2">
        <span
          className={`text-sm font-semibold ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change >= 0 ? '↑' : '↓'} 
          ${Math.abs(change).toFixed(2)}
        </span>
        <span
          className={`ml-2 text-sm font-medium ${
            changePercent >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          ({changePercent >= 0 ? '+' : ''}
          {changePercent.toFixed(2)}%)
        </span>
      </div>

      {extendedHours && !isMarketOpen && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <div className="text-gray-600 mb-1">Après clôture</div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">
              ${extendedHours.price.toFixed(2)}
            </span>
            <span className={`${
              extendedHours.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {extendedHours.change >= 0 ? '+' : ''}
              {extendedHours.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
