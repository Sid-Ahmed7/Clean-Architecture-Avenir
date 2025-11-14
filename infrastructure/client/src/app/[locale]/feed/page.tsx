import { News } from "@/types/news";
import { FeedList } from "@/components/feed/FeedList";
import { getAllNews } from "@/lib/api/news/server/news.server";



export default async function FeedPage() {
  const initialNews: News[] = await getAllNews({ page: 1, limit: 10 });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Actualités</h1>
      <FeedList initialNews={initialNews} />
    </main>
  );
}
