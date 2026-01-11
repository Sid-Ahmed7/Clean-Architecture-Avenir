"use client";

import { usePlaceOrder, useMatchOrders } from "@/hooks/useStocksOrder";
import { OrderTypeEnum } from "@/types/createOrder";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRightLeft, DollarSign, Loader2, X } from "lucide-react";
import { useNotification } from "@/hooks/useNotifications";
import { NotificationEnum } from "@/types/Notification";

interface PlaceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
  stockName: string;
  currentPrice: number;
  orderType: OrderTypeEnum;
}

export function PlaceOrderModal({isOpen,onClose,stockSymbol,stockName,currentPrice,orderType,}: PlaceOrderModalProps) {
  const t = useTranslations('stocks.orders.placeOrder');
  const tModal = useTranslations('generalErrors.placeOrderModal');
  const { addNotification } = useNotification();
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
  const currency = "€";

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
      setStatus('idle');
      addNotification(NotificationEnum.ALERT, t('error'));
    }
  };

  if (!isOpen) return null;

  const isProcessing = status !== 'idle';

  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl">
        <div className={`rounded-t-2xl px-6 py-4 text-white flex items-center justify-between ${isBuy ? "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700" : "bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700"}`}>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/70">{isBuy ? t('buyTitle') : t('sellTitle')}</p>
              <h2 className="text-xl font-semibold leading-tight">{stockSymbol} · {stockName}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={tModal("close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {isProcessing && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-800 font-medium">
                {status === 'placing' && t('statusPlacing')}
                {status === 'matching' && t('statusMatching')}
                {status === 'success' && t('statusSuccess')}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('quantity')}
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-200 disabled:bg-slate-100 disabled:cursor-not-allowed transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('pricePerShare')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(parseFloat(e.target.value) || currentPrice)}
                    disabled={isProcessing}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-200 disabled:bg-slate-100 disabled:cursor-not-allowed transition pr-10"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 text-sm">{currency}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t('currentMarketPrice')}: {currentPrice.toFixed(2)}{currency}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{t('totalAmount')}</span>
                <span className="font-semibold">{totalAmount.toFixed(2)}{currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{t('transactionFee')}</span>
                <span className="font-semibold">{fee.toFixed(2)}{currency}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2">
                <span>{isBuy ? t('totalToPay') : t('totalToReceive')}</span>
                <span className={isBuy ? "text-blue-700" : "text-emerald-600"}>
                  {totalWithFee.toFixed(2)}{currency}
                </span>
              </div>
            </div>

            {!isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  {t('autoMatchInfo')}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl transition ${
                  isBuy
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-700 hover:bg-blue-800"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <DollarSign className="h-4 w-4" />
                {status === 'idle' && (isBuy ? t('confirmBuy') : t('confirmSell'))}
                {status === 'placing' && t('buttonPlacing')}
                {status === 'matching' && t('buttonMatching')}
                {status === 'success' && t('buttonExecuted')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}