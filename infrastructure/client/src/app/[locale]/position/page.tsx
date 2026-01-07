"use client";

import { useUserPositions } from "@/hooks/usePositions";
import { useState } from "react";
import { OrderTypeEnum } from "@/types/createOrder";
import { PositionList } from "@/components/stocks/positions/PositionList";
import { PlaceOrderModal } from "@/components/stocks/orders/PlaceOrderModal";
import { useTranslations } from "next-intl";
import { BarChart3, Loader2, TrendingUp, Wallet } from "lucide-react";

export default function PortfolioPage() {
  const t = useTranslations('pages.portfolio');
  const { data: positions, isLoading, error } = useUserPositions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{
    symbol: string;
    name: string;
    price: number;
  }>({
    symbol: "",
    name: "",
    price: 0
  });

  const handleSell = (symbol: string) => {
    const position = positions?.find((p) => p.stockSymbol === symbol);
    if (position) {
      setSelectedStock({
        symbol: position.stockSymbol,
        name: position.stockSymbol,
        price: position.averagePurchasePrice
      });
      setIsModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
            <p className="text-sm text-white/70">{t('title')}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              {t('title')}
            </h1>
            <p className="text-sm text-white/70 mt-2">{t('loading')}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto" />
            <p className="text-slate-600 mt-4">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
            <p className="text-sm text-white/70">{t('title')}</p>
            <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              {t('title')}
            </h1>
            <p className="text-sm text-white/70 mt-2">{t('errorMessage')}</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl shadow-sm p-8 text-center">
            <p className="text-red-800 font-semibold">{t('errorMessage')}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPositions = positions?.length ?? 0;
  const totalQuantity = positions?.reduce((sum, p) => sum + p.totalQuantity, 0) ?? 0;
  const totalValue = positions?.reduce((sum, p) => sum + p.currentValue, 0) ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-xl border border-blue-800/40 p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-white/70">{t('title')}</p>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Wallet className="h-6 w-6" />
                {t('title')}
              </h1>
              <p className="text-sm text-white/80">Suivez vos positions et vendez en un clic.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">Positions</p>
                <p className="text-2xl font-semibold">{totalPositions}</p>
                <p className="text-xs text-white/60">actives</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">Quantité</p>
                <p className="text-2xl font-semibold">{totalQuantity}</p>
                <p className="text-xs text-white/60">actions</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">Valeur</p>
                <p className="text-2xl font-semibold">{totalValue.toFixed(2)} €</p>
                <p className="text-xs text-white/60">estimée</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Portfolio</p>
                <p className="text-sm text-slate-600">Détail de vos positions en temps réel.</p>
              </div>
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              {totalValue.toFixed(2)} €
            </div>
          </div>

          <PositionList positions={positions || []} onSell={handleSell} />
        </div>
      </div>

      <PlaceOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stockSymbol={selectedStock.symbol}
        stockName={selectedStock.name}
        currentPrice={selectedStock.price}
        orderType={OrderTypeEnum.SELL}
      />
    </div>
  );
}