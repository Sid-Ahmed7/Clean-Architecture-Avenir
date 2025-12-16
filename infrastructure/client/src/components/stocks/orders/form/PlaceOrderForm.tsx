import { OrderTypeEnum } from "@/types/createOrder";
import { OrderFields } from "@/types/orderFields";
import { useForm } from "react-hook-form";
import { OrderFormFields } from "./OrderFormFields";
import Button from "@/components/ui/Button";

interface PlaceOrderFormProps {
  stockSymbol: string;
  stockName: string;
  currentPrice: number;
  orderType: OrderTypeEnum;
  onSubmit: (data: OrderFields) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  userBalance?: number;
  blockedBalance?: number;
  userPosition?: {
    quantity: number;
    blockQuantity: number;
  };
}
export function PlaceOrderForm({stockSymbol, stockName, currentPrice, orderType, onSubmit, onCancel, isSubmitting, userBalance, blockedBalance, userPosition}: PlaceOrderFormProps) {
    const form = useForm<OrderFields>({
        defaultValues: {
            quantity: 1,
            orderPrice: currentPrice
        },
    });

    const {watch} = form;

    const quantity = watch("quantity");
    const orderPrice = watch("orderPrice");

    const totalAmount = quantity * orderPrice;
    const fee = 1;
    const totalWithFee = totalAmount + fee;
    const isBuy = orderType === OrderTypeEnum.BUY;

    const availableBalance = (userBalance ?? 0) - (blockedBalance ?? 0);
    const availableShares = userPosition
      ? userPosition.quantity - (userPosition.blockQuantity ?? 0)
      : 0;

    const hasEnoughFunds = isBuy ? availableBalance >= totalWithFee : true;
    const hasEnoughShares = !isBuy ? availableShares >= quantity : true;
    const canSubmit = hasEnoughFunds && hasEnoughShares;

   return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <OrderFormFields form={form} currentPrice={currentPrice} />

    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Montant total</span>
          <span className="font-semibold">{totalAmount.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Frais de transaction</span>
          <span className="font-semibold">{fee.toFixed(2)}€</span>
        </div>
        <div className="flex justify-between text-base font-bold border-t pt-2">
          <span>{isBuy ? "Total à payer" : "Total à recevoir"}</span>
          <span className={isBuy ? "text-red-600" : "text-green-600"}>
            {isBuy ? `${totalWithFee.toFixed(2)}€` : `${(totalAmount - fee).toFixed(2)}€`}
          </span>
        </div>
      </div>

      {isBuy && userBalance !== undefined && (
        <div className="p-3 bg-blue-50 rounded-lg text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-blue-700">Solde disponible:</span>
            <span className="font-semibold text-blue-900">{availableBalance.toFixed(2)}€</span>
          </div>
          {blockedBalance && blockedBalance > 0 && (
            <div className="text-xs text-blue-600 mt-1">
              ({blockedBalance.toFixed(2)}€ bloqués dans vos ordres)
            </div>
          )}
        </div>
      )}

      {!isBuy && userPosition && (
        <div className="p-3 bg-blue-50 rounded-lg text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-blue-700">Actions disponibles:</span>
            <span className="font-semibold text-blue-900">{availableShares}</span>
          </div>
          {userPosition.blockQuantity > 0 && (
            <div className="text-xs text-blue-600 mt-1">
              ({userPosition.blockQuantity} bloquées dans vos ordres)
            </div>
          )}
        </div>
      )}

      {isBuy && !hasEnoughFunds && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <strong>Solde insuffisant</strong>
          <div className="mt-1">
            Disponible: {availableBalance.toFixed(2)}€ | Requis: {totalWithFee.toFixed(2)}€
          </div>
        </div>
      )}

      {!isBuy && !hasEnoughShares && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <strong>Actions insuffisantes</strong>
          <div className="mt-1">
            Disponibles: {availableShares} | Requis: {quantity}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} fullWidth>
          Annuler
        </Button>
        <Button
          type="submit"
          variant={isBuy ? "primary" : "danger"}
          fullWidth
          disabled={isSubmitting || !canSubmit}
        >
          {isSubmitting
            ? "Traitement..."
            : isBuy
            ? "Confirmer l'achat"
            : "Confirmer la vente"}
        </Button>
      </div>
    </form>
  );
}