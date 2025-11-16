"use client";

import { useNews } from "@/lib/hooks/useNews";
import { FeedManageList } from "@/components/feed/FeedManageList";
import { FeedStats } from "@/components/feed/FeedStats";
import { NewsFilters } from "@/types/filtersNews";
import { useEffect, useState } from "react";
import { FeedFilters } from "@/components/feed/FeedFilters";

export default function FeedManagePage() {
  const { newsList, fetchNews, deleteNews, updateNews, loading, error, page, hasMore, setPage } = useNews();
  const [filters, setFilters] = useState<NewsFilters>({});

  useEffect(() => {
    fetchNews(filters, page, 10);
    
  }, [fetchNews, filters, page])

  const handleFilterChange = (newFilters: NewsFilters) => {
    setFilters(newFilters);
    setPage(1);
  }

  const handleNextPage = () => {
    if(hasMore) {
      setPage(page + 1);
    }
  }

    const handlePrevPage = () => {
    if(page > 1) {
      setPage(page - 1);
    }
  }
return (
    <main className="p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-bold mb-2">Gestion & Statistiques des Feeds</h1>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3">Filtres</h2>
        <FeedFilters onChange={handleFilterChange} initialFilters={filters} />
      </section>

      {loading && <p className="text-gray-500">Chargement en cours...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <section>
        <h2 className="text-xl font-semibold mb-3">Statistiques générales</h2>
        <FeedStats topFeeds={newsList} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Gérer les Feeds</h2>
        <FeedManageList news={newsList} onDelete={deleteNews} />
      </section>

      <section className="flex justify-between mt-6">
        <button
          onClick={handlePrevPage}
          disabled={page === 1 || loading}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Page précédente
        </button>
        <span>Page {page}</span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore || loading}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Page suivante
        </button>
      </section>
    </main>
  );
}