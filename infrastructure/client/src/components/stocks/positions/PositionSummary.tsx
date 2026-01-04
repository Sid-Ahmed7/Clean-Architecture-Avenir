import { useTranslations } from 'next-intl';

interface PositionSummaryProps {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export function PositionSummary({totalValue,totalCost,totalGainLoss,totalGainLossPercent}: PositionSummaryProps) {
  const t = useTranslations('components.stocks.positions.summary');
  const isProfit = totalGainLoss >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">{t('totalValue')}</p>
          <p className="text-2xl font-bold text-gray-900">{totalValue.toFixed(2)}€</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">{t('totalCost')}</p>
          <p className="text-2xl font-bold text-gray-900">{totalCost.toFixed(2)}€</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">{t('gainLoss')}</p>
          <p className={`text-2xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
            {isProfit ? "+" : ""}{totalGainLoss.toFixed(2)}€
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">{t('performance')}</p>
          <p className={`text-2xl font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
            {isProfit ? "+" : ""}{totalGainLossPercent.toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}