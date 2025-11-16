"use client";

import { FeedForm } from "@/components/feed/FeedForm";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { News } from "@/types/news";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { CreateNews } from "@/types/createNews";
import { useNews } from "@/lib/hooks/useNews";
import { useMedia } from "@/lib/hooks/useMedia";
import { UploadedFile } from "@/types/uploadedFile";

export default function EditFeedPage() {
  const { id } = useParams();
  const router = useRouter();
  const {getNews, updateNews} = useNews();
  const {fetchMediaByNewsId, uploadMedia, mediaList} = useMedia();
  const locale = useContext(LocaleContext);
  const [feed, setFeed] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
   
  const fetchNews = async () => {
    if (id) {
      const news = await getNews(Number(id));
      setFeed(news);
      await fetchMediaByNewsId(Number(id));
      setLoading(false)
    } else {
      return;
    }

  }
  useEffect(() => {
    fetchNews();    
  }, [id]);

  const existingMedia: UploadedFile[] = mediaList.map((m) => ({
    url: m.url,
    filename: m.url.split("/").pop() ?? "",
    size: m.size ?? 0,
    mimeType: m.mimeType,
    type: m.type ?? "IMAGE", 
  }));

 const handleUpdate = async (data: CreateNews, files: File[]) => {
  if (!id) return;

  const updated: News = {
    ...data,
    id: Number(id),
    views: feed?.views ?? 0,
    createdAt: feed?.createdAt ?? new Date().toISOString(),
  };

  await updateNews(updated);
  if(files.length > 0) {
    for(const file of files) {
      await uploadMedia(file, Number(id));
    }
  }
  router.push(`/${locale}/feed/manage`);
};


  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Modifier le feed</h1>
      <FeedForm initialValues={feed ?? undefined} existingMedia={existingMedia} onSubmit={handleUpdate} />
    </main>
  );
}
