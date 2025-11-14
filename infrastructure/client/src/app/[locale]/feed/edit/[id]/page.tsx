"use client";

import { FeedForm } from "@/components/feed/FeedForm";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { News } from "@/types/news";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { getAllNews, updateNews } from "@/lib/api/news/client/news";

export default function EditFeedPage() {
  const { id } = useParams();
  const router = useRouter();
  const locale = useContext(LocaleContext);
  const [feed, setFeed] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    if (id) {
      getAllNews({ page: 1, limit: 100 }).then((feeds) => {
        const f = feeds.find((n) => n.id === Number(id));
        setFeed(f || null);
      });
    }
  }, [id]);

   const handleUpdate = async (data: News) => {
    if (!id) return;
    await updateNews(data);
    router.push(`${locale}/feed/manage`);
  };


  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Modifier le feed</h1>
      <FeedForm initialValues={feed ?? undefined} onSubmit={handleUpdate} />
    </main>
  );
}
