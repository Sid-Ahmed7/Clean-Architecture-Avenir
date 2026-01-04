import { Order } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { useTranslations } from 'next-intl';

interface DirectorOrderCardProps {
    order: Order;
}

export function DirectorOrderCard({order}: DirectorOrderCardProps) {
const t = useTranslations('components.stocks.orders.directorCard');
const isBuy = order.orderType === "BUY";

return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4"
         style={{borderLeftColor: isBuy ? '#3b82f6' : '#ef4444'}}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{order.stockSymbol}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString("fr-FR")}
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
          <p className="font-semibold text-gray-900">
            {order.remainingQuantity ?? order.quantity} / {order.quantity}
          </p>
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

      <div className="p-3 bg-blue-50 rounded border border-blue-200">
        <div className="flex items-center gap-2 text-sm text-blue-800 mb-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="font-semibold">
            {isBuy
              ? t('fundsBlocked', { amount: ((order.remainingQuantity ?? order.quantity) * order.orderPrice + (order.feesPaid ? 0 : (order.fee ?? 1))).toFixed(2) })
              : t('sharesBlocked', { count: order.remainingQuantity ?? order.quantity })
            }
          </span>
        </div>
        <p className="text-xs text-blue-700">
          {t('matchingInfo')}
        </p>
      </div>
    </div>
  );
}
