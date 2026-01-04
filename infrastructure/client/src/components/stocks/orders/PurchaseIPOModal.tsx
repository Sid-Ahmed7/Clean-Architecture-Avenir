"use client";

import { purchaseIPOShares } from "@/lib/api/ipo";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from 'next-intl';

interface PurchaseIPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockName: string;
  ipoPrice: number;
  availableShares: number;
}

export function PurchaseIPOModal({isOpen,onClose,stockSymbol,stockName,ipoPrice,availableShares,}: PurchaseIPOModalProps) {
  const t = useTranslations('components.stocks.orders.purchaseIPO');
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fee = 1;
  const totalAmount = quantity * ipoPrice;
  const totalWithFee = totalAmount + fee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity > availableShares) {
      alert(
        t('errorMaxShares', { available: availableShares })
      );
      return;
    }

    try {
      setIsLoading(true);
      const result = await purchaseIPOShares({
        stockSymbol,
        quantity,
      });

      alert(`${result.message}`);

      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      queryClient.invalidateQueries({ queryKey: ["positions"] });

      onClose();
    } catch (error: any) {
      console.error("Error purchasing IPO shares:", error);
      alert(` ${error.message || t('error')}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('title')} - {stockSymbol}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{stockName}</p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700 text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💎</span>
            <div>
              <p className="font-semibold text-green-900">{t('ipoTitle')}</p>
              <p className="text-sm text-green-800 mt-1">
                {t('ipoDescription')}
              </p>
              <div className="mt-2 text-xs text-green-700">
                <span className="font-semibold">{availableShares}</span> {t('sharesRemaining')}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('quantity')}
            </label>
            <input
              type="number"
              min="1"
              max={availableShares}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('maxAvailable', { max: availableShares })}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('fixedPrice')}
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-semibold">
              {ipoPrice.toFixed(2)}€
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('fixedPriceDescription')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg space-y-2 border border-green-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{t('totalAmount')}</span>
              <span className="font-semibold text-gray-900">{totalAmount.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{t('transactionFee')}</span>
              <span className="font-semibold text-gray-900">{fee.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-green-300 pt-2">
              <span className="text-gray-900">{t('totalToPay')}</span>
              <span className="text-green-700">
                {totalWithFee.toFixed(2)}€
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              {t('instantExecutionInfo')}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {t('purchasing')}
                </span>
              ) : (
                t('buyShares', { count: quantity })
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
