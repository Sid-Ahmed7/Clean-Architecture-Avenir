import { Order } from "@/types/order";
import { OrderStatusBadge } from "./OrderStatusBadge";
import Button from "@/components/ui/Button";

interface OrderCardProps {
    order: Order;
    onCancel: (orderId: string) => void;
    isLoading: boolean;
}

export function OrderCard({order, onCancel, isLoading}: OrderCardProps) {
const isBuy = order.orderType === "BUY";
const canCancel = order.status === "PENDING";

return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
          <p className="text-sm text-gray-500">Type</p>
          <p className={`font-semibold ${isBuy ? "text-blue-600" : "text-red-600"}`}>
            {isBuy ? "Achat" : "Vente"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Quantité</p>
          <p className="font-semibold text-gray-900">{order.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Prix unitaire</p>
          <p className="font-semibold text-gray-900">{order.orderPrice.toFixed(2)}€</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Montant total</p>
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
                ? `${((order.remainingQuantity ?? order.quantity) * order.orderPrice + (order.feesPaid ? 0 : (order.fee ?? 1))).toFixed(2)}€ bloqués`
                : `${order.remainingQuantity ?? order.quantity} actions bloquées`
              }
            </span>
          </div>
          <p className="text-xs text-orange-700">
            Ces {isBuy ? "fonds" : "actions"} seront débloqué(e)s si vous annulez l&apos;ordre
          </p>
        </div>
      )}

      {order.executedAt && (
        <div className="mb-4 p-3 bg-green-50 rounded">
          <p className="text-sm text-green-800">
            Exécuté le {new Date(order.executedAt).toLocaleString("fr-FR")}
          </p>
          {order.executionPrice && (
            <p className="text-sm text-green-800">
              Prix d&apos;exécution: {order.executionPrice.toFixed(2)}€
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
          {isLoading ? "Annulation..." : "Annuler l'ordre"}
        </Button>
      )}
    </div>
  );
}