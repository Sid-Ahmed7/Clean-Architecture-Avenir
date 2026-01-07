"use client";

import { FeedForm } from "@/components/feed/form/FeedForm";
import { useTranslations } from 'next-intl';



export default function CreateFeedPage() {
  const t = useTranslations('components.feed.form');

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>

        <FeedForm />
      </div>
    </main>
  );
}

