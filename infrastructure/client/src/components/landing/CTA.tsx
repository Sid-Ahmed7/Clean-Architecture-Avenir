"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from 'next-intl';

export default function CTA() {
  const t = useTranslations('landing.cta');
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('description')}
          </p>
          <Link href="/register" className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.05] active:scale-[0.95]">
            {t('button')}
          </Link>
          <p className="text-sm text-blue-100 mt-6">
            {t('benefits')}
          </p>
        </div>
      </div>
    </section>
  );
}