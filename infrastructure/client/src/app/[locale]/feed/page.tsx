import { News } from "@/types/news";
import { FeedList } from "@/components/feed/FeedList";
import { getAllNews } from "@/lib/api/news/server/news.server";
import { getTranslations } from "next-intl/server";

export default async function FeedPage() {
  const t = await getTranslations('pages.feed');
  const initialNews = await getAllNews({ page: 1, limit: 10 });
  return (
    <main className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">{t('title')}</h1>
      <FeedList initialNews={initialNews} />
    </main>
  );
}
