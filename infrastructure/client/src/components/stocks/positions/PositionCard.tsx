import Button from "@/components/ui/Button";
import { PositionWithDetails } from "@/types/position";
import { useTranslations } from 'next-intl';

interface PositionCardProps {
    position: PositionWithDetails;
    onSell?: (symbol: string) => void;
}

export function PositionCard({ position, onSell }: PositionCardProps) {
    const t = useTranslations('components.stocks.positions.card');
    const gainLoss = position.profitLoss;
    const gainLossPercentage = position.profitLossPercent;
    const isProfit = gainLoss >= 0;

    const blockedQuantity = position.blockQuantity ?? 0;
    const availableQuantity = position.quantity - blockedQuantity;

     return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{position.stockSymbol}</h3>
          <p className="text-sm text-gray-500">{position.stockName}</p>
        </div>
        <div className={`text-right ${isProfit ? "text-green-600" : "text-red-600"}`}>
          <p className="text-lg font-bold">
            {isProfit ? "+" : ""}{gainLoss.toFixed(2)}€
          </p>
          <p className="text-sm">
            {isProfit ? "+" : ""}{gainLossPercentage.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">{t('totalQuantity')}</p>
          <p className="font-semibold text-gray-900">{position.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('available')}</p>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-green-700">{availableQuantity}</p>
            {blockedQuantity > 0 && (
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                {t('blocked', { count: blockedQuantity })}
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('averagePrice')}</p>
          <p className="font-semibold text-gray-900">{position.averagePurchasePrice.toFixed(2)}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('currentPrice')}</p>
          <p className="font-semibold text-gray-900">{position.currentPrice.toFixed(2)}€</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500">{t('currentValue')}</p>
          <p className="font-semibold text-gray-900">{position.currentValue.toFixed(2)}€</p>
        </div>
      </div>

      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('totalCost')}</span>
          <span className="font-semibold text-gray-900">{position.totalInvested.toFixed(2)}€</span>
        </div>
      </div>

      {onSell && (
        <div>
          {blockedQuantity > 0 && availableQuantity === 0 ? (
            <div className="text-center p-3 bg-orange-50 rounded text-sm text-orange-700">
              {t('allBlocked')}
            </div>
          ) : (
            <Button
              variant="danger"
              fullWidth
              onClick={() => onSell(position.stockSymbol)}
              disabled={availableQuantity === 0}
            >
              {t('sell')} {availableQuantity > 0 ? t('availableCount', { count: availableQuantity }) : ''}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
