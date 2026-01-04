import { useTranslations } from 'next-intl';

interface StockHeaderProps {
    symbol: string;
    name: string;
    exchange: string;
    isMarketOpen: boolean;
}

export function StockHeader({symbol, name, exchange, isMarketOpen} :StockHeaderProps) {
    const t = useTranslations('components.stocks.structure.header');
    return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900">
          {symbol}
        </h3>
        <p className="text-sm text-gray-600 truncate">
          {name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
            {exchange}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${
            isMarketOpen 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isMarketOpen ? `🟢 ${t('open')}` : `⚫ ${t('closed')}`}
          </span>
        </div>
      </div>
    </div>
  );
}