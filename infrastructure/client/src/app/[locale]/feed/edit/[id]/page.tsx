"use client";

import { FeedForm } from "@/components/feed/FeedForm";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { News } from "@/types/news";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { CreateNews } from "@/types/createNews";
import { useNews } from "@/lib/hooks/useNews";

export default function EditFeedPage() {
  const { id } = useParams();
  const router = useRouter();
  const {getNews, updateNews} = useNews();
  const locale = useContext(LocaleContext);
  const [feed, setFeed] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
   
  useEffect(() => {
    if (id) {
    getNews(Number(id)).then((f) => setFeed(f));

    }
  }, [id]);

 const handleUpdate = async (data: CreateNews, files: File[]) => {
  if (!id) return;

  const updated: News = {
    ...data,
    id: Number(id),
    views: feed?.views ?? 0,
    createdAt: feed?.createdAt ?? new Date().toISOString(),
  };

  await updateNews(updated);
  router.push(`/${locale}/feed/manage`);
};


  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Modifier le feed</h1>
      <FeedForm initialValues={feed ?? undefined} onSubmit={handleUpdate} />
    </main>
  );
}
