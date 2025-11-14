"use client";

import { useNews } from "@/lib/hooks/useNews";
import { FeedManageList } from "@/components/feed/FeedManageList";
import { FeedStats } from "@/components/feed/FeedStats";

export default function FeedManagePage() {
  const { newsList, deleteNews, updateNews, loading, error } = useNews();

  return (
    <main className="p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-bold mb-2">Gestion & Statistiques des Feeds</h1>
        <p className="text-gray-600">Analysez les performances et gérez les actualités du conseiller.</p>
      </header>

      {loading && <p className="text-gray-500">Chargement en cours...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <section>
        <h2 className="text-xl font-semibold mb-3">Statistiques générales</h2>
        <FeedStats topFeeds={newsList} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Gérer les Feeds</h2>
        <FeedManageList news={newsList} onDelete={deleteNews} onUpdate={updateNews} />
      </section>
    </main>
  );
}
