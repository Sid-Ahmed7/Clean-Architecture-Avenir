"use client";

import { OrderTypeEnum } from "@/types/createOrder";
import { OrderFields } from "@/types/orderFields";
import { useState } from "react";
import { PlaceOrderForm } from "./PlaceOrderForm";

interface PlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockName: string;
  currentPrice: number;
  orderType: OrderTypeEnum;
}

export function PlaceOrderModal({isOpen,onClose,stockSymbol,stockName,currentPrice,orderType}: PlaceOrderModalProps) {
//   const placeOrderMutation = usePlaceOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: OrderFields) => {
    setIsSubmitting(true);
    try {
      await placeOrderMutation.mutateAsync({
        stockSymbol,
        orderType,
        ...data,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {orderType === "BUY" ? "Acheter" : "Vendre"} {stockSymbol}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">{stockName}</p>

        <PlaceOrderForm
          stockSymbol={stockSymbol}
          stockName={stockName}
          currentPrice={currentPrice}
          orderType={orderType}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
