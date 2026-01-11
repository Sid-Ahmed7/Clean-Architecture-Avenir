"use client";

import { services } from "@/constants/services";
import ServiceCard from "./cards/ServiceCard";
import { useTranslations } from 'next-intl';

export default function Services() {
  const t = useTranslations('landing.services');
  
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-xl text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              {...service}
              title={t(service.titleKey)}
              description={t(service.descriptionKey)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}