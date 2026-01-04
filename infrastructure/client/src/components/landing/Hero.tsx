"use client";

import { Link } from "@/i18n/navigation";
import { ArrowLeftRight, PiggyBank, TrendingUp } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('landing.hero');
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t('title')} <span className="text-blue-200">{t('titleHighlight')}</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              {t('description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register" className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-center">
                {t('createAccount')}
              </Link>
              <Link href="/about" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 text-center">
                {t('learnMore')}
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-100">{t('demo.checkingAccount')}</span>
                  <span className="text-xs bg-emerald-500 px-3 py-1 rounded-full">{t('demo.active')}</span>
                </div>
                <div>
                  <p className="text-sm text-blue-100 mb-2">{t('demo.availableBalance')}</p>
                  <p className="text-4xl font-bold">12 450,75 €</p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition cursor-pointer">
                    <ArrowLeftRight className="text-2xl mb-2 mx-auto" size={24} />
                    <p className="text-xs">{t('demo.transfer')}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition cursor-pointer">
                    <PiggyBank className="text-2xl mb-2 mx-auto" size={24} />
                    <p className="text-xs">{t('demo.savings')}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center hover:bg-white/20 transition cursor-pointer">
                    <TrendingUp className="text-2xl mb-2 mx-auto" size={24} />
                    <p className="text-xs">{t('demo.stock')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}