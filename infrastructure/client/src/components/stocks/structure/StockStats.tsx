interface StocksStatsProps {
    open: number;
    previousClose: number;
    high: number;
    low: number;
}

export function StocksStats({open, previousClose, high, low}: StocksStatsProps) {
    return (
    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
      <div>
        <div className="text-gray-500">Ouverture</div>
        <div className="font-semibold text-gray-900">
          ${open.toFixed(2)}
        </div>
      </div>
      <div>
        <div className="text-gray-500">Clôture préc.</div>
        <div className="font-semibold text-gray-900">
          ${previousClose.toFixed(2)}
        </div>
      </div>
      <div>
        <div className="text-gray-500">Plus haut</div>
        <div className="font-semibold text-green-600">
          ${high.toFixed(2)}
        </div>
      </div>
      <div>
        <div className="text-gray-500">Plus bas</div>
        <div className="font-semibold text-red-600">
          ${low.toFixed(2)}
        </div>
      </div>
    </div>
  );
}