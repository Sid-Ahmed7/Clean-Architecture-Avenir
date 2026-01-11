"use client";

import { FeedForm } from "@/components/feed/form/FeedForm";
import { useTranslations } from 'next-intl';



export default function CreateFeedPage() {
  const t = useTranslations('components.feed.form');
  const tCreate = useTranslations('components.feed.form');

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-100 blur-3xl opacity-70" />
        <div className="absolute left-[-10rem] bottom-[-4rem] h-80 w-80 rounded-full bg-indigo-100 blur-3xl opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.06),_transparent_35%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-16 space-y-8">
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white rounded-3xl shadow-2xl border border-blue-800/40 p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-white/70 uppercase tracking-wide">{tCreate('newTitle')}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{tCreate('newTitle')}</h1>
              <p className="text-sm text-white/80">{tCreate('newSubtitle')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto">
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{tCreate('highlight')}</p>
                <p className="text-lg font-semibold">{tCreate('highlightValue')}</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-white/70">{tCreate('writing')}</p>
                <p className="text-lg font-semibold">{tCreate('writingValue')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8">
          <FeedForm />
        </div>
      </div>
    </main>
  );
}

