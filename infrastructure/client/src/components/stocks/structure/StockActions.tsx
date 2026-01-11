import { useTranslations } from 'next-intl';

interface StockActionsProps {
    symbol: string;
    onBuy?: (symbol: string) => void;
    onSell?: (symbol: string) => void;
    lastUpdated: string;
}

export function StockActions({symbol, onBuy, onSell,lastUpdated} :StockActionsProps) {
  const t = useTranslations('components.stocks.structure.actions');
   return (
    <div>
      <div className="flex gap-2">
        {onBuy && (
          <button 
            onClick={() => onBuy(symbol)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('buy')}
          </button>
        )}
        {onSell && (
          <button 
            onClick={() => onSell(symbol)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t('sell')}
          </button>
        )}
      </div>

      <div className="mt-3 text-xs text-center text-gray-500">
        {t('lastUpdated')}: {new Date(lastUpdated).toLocaleString('fr-FR')}
      </div>
    </div>
  );
}