"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateNewsModel } from "@/lib/validation/news/createNewsSchema";
import { Block, TypeBlock } from "@/types/contentBlock";
import { Loader2 } from "lucide-react";
import { useNewsById } from "@/hooks/useNews";
import { useContentsByNewsId } from "@/hooks/useContent";
import { FeedForm } from "@/components/feed/form/FeedForm";
import { useMediaByNewsId } from "@/hooks/useMedia";
import { useTranslations } from "next-intl";

export default function EditFeedPage() {
  const t = useTranslations("pages.feed.edit");
  const { id } = useParams();
  const newsId = id as string;

  const { data: news, isLoading: newsLoading } = useNewsById(newsId);
  const { data: contents, isLoading: contentsLoading } = useContentsByNewsId(newsId);
  const { data: medias, isLoading: mediaLoading} = useMediaByNewsId(newsId);

  const [initialValues, setInitialValues] = useState<CreateNewsModel>();
  const [initialBlocks, setInitialBlocks] = useState<Block[]>([]);
  const previousContentsRef = useRef<string>('');

  useEffect(() => {
    if (newsLoading || contentsLoading || mediaLoading) {
      return;
    }



    const contentsKey = JSON.stringify({
      contents: Array.isArray(contents) ? contents.map(c => c.id).sort() : [],
      medias: Array.isArray(medias) ? medias.map(m => m.id).sort() : []
    });

    if (previousContentsRef.current === contentsKey) {
      return;
    }

    previousContentsRef.current = contentsKey;

    if (news) {
      setInitialValues({
        title: news.title,
        category: news.category,
        priority: news.priority,
        tags: news.tags || [],
      });
    }

    const textBlocks: Block[] = (Array.isArray(contents) ? contents : []).map((content) => ({
      id: content.id,
      type: TypeBlock.TEXT,
      order: content.order,
      content: content.content,
    }));

    const mediaBlocks: Block[] = (Array.isArray(medias) ? medias : []).map((media) => ({
      id: media.id,
      type: TypeBlock.MEDIA,
      order: media.order ?? 0,
      files: [],
      existingMedias: [media]
    }));

    const allBlocks = [...textBlocks, ...mediaBlocks].sort((a, b) => a.order - b.order);
    setInitialBlocks(allBlocks);
}, [news, contents, medias, newsLoading, contentsLoading, mediaLoading]);

return (
  <>
    {(newsLoading || contentsLoading || mediaLoading) && (
      <main className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">{t("loading")}</span>
        </div>
      </main>
    )}

    {!news && !newsLoading && (
      <main className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{t("notFound")}</p>
        </div>
      </main>
    )}

    {news && !newsLoading && !contentsLoading && !mediaLoading && (
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600 mt-2">{t("subtitle")}</p>
        </div>

        <FeedForm
          newsId={newsId}
          initialValues={initialValues}
          initialBlocks={initialBlocks}
        />
      </main>
    )}
  </>
);

}