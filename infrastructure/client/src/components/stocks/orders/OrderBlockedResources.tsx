import { OrderType } from "@/types/order";
import { useTranslations } from 'next-intl';

interface OrderBlockedResourcesProps {
  orderType: OrderType;
  remainingQuantity: number;
  orderPrice: number;
  feesPaid: boolean;
  fee?: number;
}

export function OrderBlockedResources({orderType,remainingQuantity,orderPrice,feesPaid,fee}: OrderBlockedResourcesProps) {
  const t = useTranslations('components.stocks.orders.blockedResources');
  const isBuy = orderType === "BUY";

  return (
    <div className="mb-4 p-3 bg-orange-50 rounded border border-orange-200">
      <div className="flex items-center gap-2 text-sm text-orange-800 mb-1">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <span className="font-semibold">
          {isBuy
            ? t('fundsBlocked', { amount: (remainingQuantity * orderPrice + (feesPaid ? 0 : (fee ?? 1))).toFixed(2) })
            : t('sharesBlocked', { count: remainingQuantity })
          }
        </span>
      </div>
      <p className="text-xs text-orange-700">
        {isBuy ? t('fundsWillBeUnlocked') : t('sharesWillBeUnlocked')}
      </p>
    </div>
  );
}
