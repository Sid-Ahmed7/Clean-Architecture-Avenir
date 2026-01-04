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
import { useTranslations } from "next-intl";

interface FeedListProps {
    initialNews: News[]
}
export function FeedList({initialNews} : FeedListProps) {
  const t = useTranslations('components.feed.list');
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
                    <p className="text-gray-500 mt-2">{t('loading')}</p>
                </div>
            ) : error ? (
                <p className="text-red-500">{t('error', { message: error.message })}</p>
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
