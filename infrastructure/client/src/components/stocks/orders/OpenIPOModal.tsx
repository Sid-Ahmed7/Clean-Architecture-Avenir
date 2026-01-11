"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { getErrorMessage } from "@/lib/utils/error";
import { NotificationEnum } from "@/types/Notification";
import { useNotification } from "@/hooks/useNotifications";

interface OpenIPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockName: string;
  totalShares: number;
  onConfirm: (sharesToMakeAvailable: number, ipoType: "INITIAL" | "SECONDARY") => Promise<void>;
}

export function OpenIPOModal({isOpen,onClose,stockSymbol,stockName,totalShares,onConfirm,}: OpenIPOModalProps) {
  const t = useTranslations('components.stocks.orders.openIPO');
  const [sharesToMakeAvailable, setSharesToMakeAvailable] = useState(totalShares);
  const [ipoType, setIpoType] = useState<'INITIAL' | 'SECONDARY'>('INITIAL');
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sharesToMakeAvailable <= 0) {
      addNotification(NotificationEnum.ACTION, t('errorMinShares'));
      return;
    }

    if (sharesToMakeAvailable > totalShares) {
      addNotification(NotificationEnum.ACTION, t('errorMaxShares', { max: totalShares }));
      return;
    }

    try {
      setIsLoading(true);
      await onConfirm(sharesToMakeAvailable, ipoType);
      addNotification(NotificationEnum.INFO, t('success', { symbol: stockSymbol }));
      onClose();
    } catch (error) {
        const message = getErrorMessage(error as Error, t('error'));
        addNotification(NotificationEnum.ALERT, message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
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

        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💎</span>
            <div>
              <p className="font-semibold text-blue-900">{t('ipoTitle')}</p>
              <p className="text-sm text-blue-800 mt-1">
                {t('ipoDescription')}
              </p>
              <div className="mt-2 text-xs text-blue-700">
                <span className="font-semibold">{t('totalShares')}:</span> {totalShares}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('sharesLabel')}
            </label>
            <input
              type="number"
              min="1"
              max={totalShares}
              value={sharesToMakeAvailable}
              onChange={(e) => setSharesToMakeAvailable(parseInt(e.target.value) || 0)}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('maxShares', { max: totalShares })}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('ipoType')}
            </label>
            <select
              value={ipoType}
              onChange={(e) => setIpoType(e.target.value as 'INITIAL' | 'SECONDARY')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="PRIMARY">{t('initialIPO')}</option>
              <option value="SECONDARY">{t('secondaryIPO')}</option>
            </select>
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
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {t('opening')}
                </span>
              ) : (
                t('openIPO')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
