"use client";

import { useTranslations } from 'next-intl';

export default function Stats() {
  const t = useTranslations('landing.stats');
  
  const stats = [
    { value: t('clients.value'), label: t('clients.label') },
    { value: t('transfers.value'), label: t('transfers.label') },
    { value: t('support.value'), label: t('support.label') },
    { value: t('rating.value'), label: t('rating.label') }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}