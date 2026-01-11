"use client";

import { useState } from "react";
import { StockForm } from "./forms/StockForm";
import { useCreateStock } from "@/hooks/useStocks";
import { CreateStock } from "@/types/createStock";
import { useTranslations } from 'next-intl';
import { Building2, X } from "lucide-react";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateStockModal({ isOpen, onClose }: StockModalProps) {
  const t = useTranslations('stocks.forms.stockForm');
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
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/70">{t('create')}</p>
              <h2 className="text-xl font-semibold leading-tight">{t('newStock')}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label={t('close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <StockForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}