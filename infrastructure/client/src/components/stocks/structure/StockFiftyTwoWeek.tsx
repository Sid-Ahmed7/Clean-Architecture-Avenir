import { FiftyTwoWeek } from "@/types/stock";

interface StockFiftyTwoWeekProps {
    fiftyTwoWeek: FiftyTwoWeek;
}

export function StockFiftyTwoWeek({fiftyTwoWeek} : StockFiftyTwoWeekProps) {
    return (
    <div className="mb-4 p-3 bg-blue-50 rounded text-xs">
      <div className="font-semibold text-blue-900 mb-2">
        Sur 52 semaines
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-blue-700">Plus bas</div>
          <div className="font-semibold text-blue-900">
            ${fiftyTwoWeek.low.toFixed(2)}
          </div>
          <div className={`text-xs ${
            fiftyTwoWeek.lowChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {fiftyTwoWeek.lowChange >= 0 ? '+' : ''}
            {fiftyTwoWeek.lowChangePercent.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-blue-700">Plus haut</div>
          <div className="font-semibold text-blue-900">
            ${fiftyTwoWeek.high.toFixed(2)}
          </div>
          <div className={`text-xs ${
            fiftyTwoWeek.highChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {fiftyTwoWeek.highChange >= 0 ? '+' : ''}
            {fiftyTwoWeek.highChangePercent.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
