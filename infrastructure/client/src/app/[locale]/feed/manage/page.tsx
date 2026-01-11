"use client";

import { useAllNews, useNewsMutation } from "@/hooks/useNews";
import { FeedManageList } from "@/components/feed/FeedManageList";
import { NewsFilters } from "@/types/filtersNews";
import { useState } from "react";
import { FeedFilters } from "@/components/feed/FeedFilters";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FeedManagePage() {
  const t = useTranslations("pages.feed.manage");
  const [filters, setFilters] = useState<NewsFilters>({});
  const { data: newsList = [], isLoading, error } = useAllNews(filters);
  const { deleteNews } = useNewsMutation();


  const handleFilterChange = (newFilters: NewsFilters) => {
    setFilters(newFilters);
  }

  const handleDelete = async (id: string) => {
    await deleteNews.mutateAsync(id);
  }

return (
     <main className="container mx-auto p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </header>

      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t("filtersTitle")}</h2>
        <FeedFilters onChange={handleFilterChange} initialFilters={filters} />
      </section>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">{t("loading")}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{t("error", { message: error.message })}</p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{t("manageNewsTitle")}</h2>
            <FeedManageList news={newsList} onDelete={handleDelete} />
          </section>
        </>
      )}
    </main>
  );
}