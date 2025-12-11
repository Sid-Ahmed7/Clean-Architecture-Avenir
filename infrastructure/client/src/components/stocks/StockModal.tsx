"use client";

import { useState } from "react";
import { StockForm } from "./forms/StockForm";
import { useCreateStock } from "@/hooks/useStocks";
import { CreateStock } from "@/types/createStock";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStockModal({ isOpen, onClose }: StockModalProps) {
  const createStockMutation = useCreateStock();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateStock) => {
    setIsSubmitting(true);
    try {
      await createStockMutation.mutateAsync(data);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Créer une action
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <StockForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}