interface PositionSummaryProps {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export function PositionSummary({
  totalValue,
  totalCost,
  totalGainLoss,
  totalGainLossPercent
}: PositionSummaryProps) {
  const isProfit = totalGainLoss >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Résumé du portefeuille</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Valeur totale</p>
          <p className="text-2xl font-bold text-gray-900">{totalValue.toFixed(2)}€</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">Coût total</p>
          <p className="text-2xl font-bold text-gray-900">{totalCost.toFixed(2)}€</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">Gain/Perte</p>
          <p className={`text-2xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
            {isProfit ? "+" : ""}{totalGainLoss.toFixed(2)}€
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">Performance</p>
          <p className={`text-2xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
            {isProfit ? "+" : ""}{totalGainLossPercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}