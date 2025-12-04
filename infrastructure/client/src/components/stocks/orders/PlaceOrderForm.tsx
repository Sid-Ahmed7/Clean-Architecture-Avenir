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
}
achat fractionner
export function PlaceOrderForm({stockSymbol, stockName, currentPrice, orderType, onSubmit, onCancel, isSubmitting}: PlaceOrderFormProps) {
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

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} fullWidth>
          Annuler
        </Button>
        <Button
          type="submit"
          variant={isBuy ? "primary" : "danger"}
          fullWidth
          disabled={isSubmitting}
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