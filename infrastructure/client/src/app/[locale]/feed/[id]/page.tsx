import { getNewsById } from "@/lib/api/news/server/news.server";
import { notFound } from "next/navigation";
import { FeedDetail } from "@/components/feed/FeedDetails";
import { getContentsByNewsId } from "@/lib/api/news/server/content.server";
import { getMediaByNewsId } from "@/lib/api/news/server/media.server";

interface FeedPageProps {
  params: {
    id: string;
  };
}

export default async function FeedDetailPage({ params }: FeedPageProps) {
  const { id } = await params;
  const newsId = Number(id);

 const [news, contents, media] = await Promise.all([
    getNewsById(newsId),
    getContentsByNewsId(newsId),
    getMediaByNewsId(newsId),
  ]);

  if (!news) return notFound();

  

  return (
    <FeedDetail news={news} contents={contents} medias={media} />

  );
}
