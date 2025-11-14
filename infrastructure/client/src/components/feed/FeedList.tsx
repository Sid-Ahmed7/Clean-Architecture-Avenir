"use client";

import { useNews } from "@/lib/hooks/useNews";
import { useNewsSSE } from "@/lib/hooks/useNewsSSE";
import { NewsFilters } from "@/types/filtersNews";
import { News } from "@/types/news";
import { useEffect } from "react";
import { FeedFilters } from "./FeedFilters";
import { FeedCard } from "./FeedCard";
import { Pagination } from "../ui/Pagination";

interface FeedListProps {
    initialNews: News[];
}

export function FeedList({initialNews} : FeedListProps) {
   const { newsList, fetchNews, page, hasMore, loading, error, setPage } = useNews(initialNews);
  const { news, setNews } = useNewsSSE(initialNews);

  useEffect(() => {
    if(news.length !== newsList.length) {
        setNews(newsList);
    }
  }, [newsList, news, setNews]);

  const handleFilterChange = (filters: NewsFilters) => {
    fetchNews(filters, 1);
  }

  return (
    <section className="space-y-6">
      <FeedFilters onChange={handleFilterChange} />

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-gray-500">Chargement...</p>}

      <div className="grid gap-4">
        {newsList.length > 0 ? (
          newsList.map((n) => <FeedCard key={n.id} news={n} />)
        ) : (
          <p className="text-gray-500 text-center">Aucun article trouvé.</p>
        )}
      </div>

      <Pagination
        currentPage={page}
        hasMore={hasMore}
        onNext={() => fetchNews({}, page + 1)}
        onPrev={() => fetchNews({}, page - 1)}
      />
    </section>
  );
}