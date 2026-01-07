import { Order } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import Button from "@/components/ui/Button";
import { useTranslations, useLocale } from 'next-intl';

interface OrderCardProps {
  order: Order;
  onCancel: (orderId: string) => void;
  isLoading: boolean;
}

export function OrderCard({ order, onCancel, isLoading }: OrderCardProps) {
  const t = useTranslations('components.stocks.orders.card');
  const locale = useLocale();
  const isBuy = order.orderType === "BUY";
  const canCancel = order.status === "PENDING";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{order.stockSymbol}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString(locale)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">{t('type')}</p>
          <p className={`font-semibold ${isBuy ? "text-blue-600" : "text-red-600"}`}>
            {isBuy ? t('buy') : t('sell')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('quantity')}</p>
          <p className="font-semibold text-gray-900">{order.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('unitPrice')}</p>
          <p className="font-semibold text-gray-900">{order.orderPrice.toFixed(2)}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('totalAmount')}</p>
          <p className="font-semibold text-gray-900">
            {(order.quantity * order.orderPrice).toFixed(2)}€
          </p>
        </div>
      </div>

      {order.status === "PENDING" && (
        <div className="mb-4 p-3 bg-orange-50 rounded border border-orange-200">
          <div className="flex items-center gap-2 text-sm text-orange-800 mb-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">
              {isBuy
                ? t('fundsBlocked', { amount: ((order.remainingQuantity ?? order.quantity) * order.orderPrice + (order.feesPaid ? 0 : (order.fee ?? 1))).toFixed(2) })
                : t('sharesBlocked', { count: order.remainingQuantity ?? order.quantity })
              }
            </span>
          </div>
          <p className="text-xs text-orange-700">
            {isBuy ? t('fundsWillBeUnlocked') : t('sharesWillBeUnlocked')}
          </p>
        </div>
      )}

      {order.executedAt && (
        <div className="mb-4 p-3 bg-green-50 rounded">
          <p className="text-sm text-green-800">
            {t('executedAt', { date: new Date(order.executedAt).toLocaleString(locale) })}
          </p>
          {order.executionPrice && (
            <p className="text-sm text-green-800">
              {t('executionPrice', { price: order.executionPrice.toFixed(2) })}
            </p>
          )}
        </div>
      )}

      {canCancel && onCancel && (
        <Button
          variant="danger"
          fullWidth
          onClick={() => onCancel(order.id)}
          disabled={isLoading}
        >
          {isLoading ? t('cancelling') : t('cancelOrder')}
        </Button>
      )}
    </div>
  );
}