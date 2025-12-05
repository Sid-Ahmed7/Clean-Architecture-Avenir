"use client";
import { useNewsInfinite } from "@/hooks/useNews";
import { useNewsSSE } from "@/hooks/useNewsSSE";
import { NewsFilters } from "@/types/filtersNews";
import { useState } from "react";
import { FeedFilters } from "./FeedFilters";
import { Loader2 } from "lucide-react";
import { FeedGrid } from "./FeedGrid";
import { LoadMoreButton } from "./LoadMoreButton";
import { News } from "@/types/news";

interface FeedListProps {
    initialNews: News[]
}
export function FeedList({initialNews} : FeedListProps) {
  const [filters, setFilters] = useState<NewsFilters>({})

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error} = useNewsInfinite(filters, 10);

  useNewsSSE();

const allNews = data?.pages.flatMap((page) => page.data ?? []) ?? initialNews;
return (
        <section className="space-y-6">
            <FeedFilters onChange={setFilters} />

            {isLoading && allNews?.length === 0 ? (
                <div className="text-center py-8">
                    <Loader2 className="inline-block h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-gray-500 mt-2">Chargement...</p>
                </div>
            ) : error ? (
                <p className="text-red-500">Erreur : {error.message}</p>
            ) : (
                <>
                    <FeedGrid allNews={allNews} />
                    {hasNextPage && (
                        <LoadMoreButton
                            hasNextPage={hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                        />
                    )}
                </>
            )}
        </section>
    );
}
