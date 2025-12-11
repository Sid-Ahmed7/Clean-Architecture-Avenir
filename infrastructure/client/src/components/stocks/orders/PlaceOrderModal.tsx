"use client";

import { usePlaceOrder, useMatchOrders } from "@/hooks/useStocksOrder";
import { OrderTypeEnum } from "@/types/createOrder";
import { useState } from "react";

interface PlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockName: string;
  currentPrice: number;
  orderType: OrderTypeEnum;
}

export function PlaceOrderModal({
  isOpen,
  onClose,
  stockSymbol,
  stockName,
  currentPrice,
  orderType,
}: PlaceOrderModalProps) {
  const placeOrderMutation = usePlaceOrder();
  const matchOrdersMutation = useMatchOrders();
  
  const [quantity, setQuantity] = useState(1);
  const [orderPrice, setOrderPrice] = useState(currentPrice);
  const [status, setStatus] = useState<'idle' | 'placing' | 'matching' | 'success'>('idle');

  const fee = 1;
  const totalAmount = quantity * orderPrice;
  const totalWithFee =
    orderType === OrderTypeEnum.BUY
      ? totalAmount + fee
      : totalAmount - fee;
  const isBuy = orderType === OrderTypeEnum.BUY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setStatus('placing');
      await placeOrderMutation.mutateAsync({
        stockSymbol,
        quantity,
        orderPrice,
        orderType,
      });

      setStatus('matching');
      await matchOrdersMutation.mutateAsync(stockSymbol);

      setStatus('success');
      
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Error placing order:", error);
      setStatus('idle');
      alert("Erreur lors du placement de l'ordre");
    }
  };

  if (!isOpen) return null;

  const isProcessing = status !== 'idle';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {isBuy ? "Acheter" : "Vendre"} {stockSymbol}
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-500 hover:text-gray-700 text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">{stockName}</p>

        {isProcessing && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm text-blue-800 font-medium">
                {status === 'placing' && '📝 Placement de l\'ordre...'}
                {status === 'matching' && '🔄 Recherche de correspondances...'}
                {status === 'success' && '✅ Ordre exécuté avec succès !'}
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantité
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              disabled={isProcessing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix par action (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={orderPrice}
              onChange={(e) => setOrderPrice(parseFloat(e.target.value) || currentPrice)}
              disabled={isProcessing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Prix actuel du marché : {currentPrice.toFixed(2)}€
            </p>
          </div>

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
                {totalWithFee.toFixed(2)}€
              </span>
            </div>
          </div>

          {!isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>Exécution instantanée :</strong> Votre ordre sera automatiquement 
                comparé aux ordres existants pour une exécution immédiate si possible.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                isBuy
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {status === 'idle' && (isBuy ? "Confirmer l'achat" : "Confirmer la vente")}
              {status === 'placing' && "Placement..."}
              {status === 'matching' && "Matching..."}
              {status === 'success' && "✓ Exécuté"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}