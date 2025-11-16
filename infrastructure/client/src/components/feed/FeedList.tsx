"use client";

import { useNews } from "@/lib/hooks/useNews";
import { useNewsSSE } from "@/lib/hooks/useNewsSSE";
import { NewsFilters } from "@/types/filtersNews";
import { News } from "@/types/news";
import { useEffect, useState } from "react";
import { FeedFilters } from "./FeedFilters";
import { FeedCard } from "./FeedCard";
import { Pagination } from "../ui/Pagination";
import { Media } from "@/types/media";
import { useMedia } from "@/lib/hooks/useMedia";

interface FeedListProps {
    initialNews: News[];
}

export function FeedList({initialNews} : FeedListProps) {
   const { newsList, fetchNews, page, hasMore, loading, error, setPage } = useNews(initialNews);
   const { news, setNews } = useNewsSSE(initialNews);
   const [newsWithMedia, setNewsWithMedia] = useState<Map<number, Media[]>>(new Map());
   const { fetchMediaByNewsId, loading: loadingMedia, error: mediaError } = useMedia();

    useEffect(() => {
        const loadMediaForNews = async () => {
            const mediaMap = new Map<number, Media[]>();

            const mediaResults = await Promise.all(
                newsList.map(async (newsItem) => {
                    try {
                        const media = await fetchMediaByNewsId(newsItem.id);
                        return { newsId: newsItem.id, media };
                    } catch (error) {
                        console.error(`Erreur chargement médias pour news ${newsItem.id}:`, error);
                        return { newsId: newsItem.id, media: [] };
                    }
                })
            );

            mediaResults.forEach(({ newsId, media }) => {
                mediaMap.set(newsId, media);
            });

            setNewsWithMedia(mediaMap);
        };

        if (newsList.length > 0) {
            loadMediaForNews();
        }
    }, [newsList, fetchMediaByNewsId]);



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
      {mediaError && (
                <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg">
                    Erreur lors du chargement des médias: {mediaError}
                </div>
            )}
      {(loading || loadingMedia) && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Chargement...</p>
          </div>
      )}

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