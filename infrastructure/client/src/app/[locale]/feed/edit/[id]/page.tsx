"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateNewsModel } from "@/lib/validation/news/createNewsSchema";
import { Block, TypeBlock } from "@/types/contentBlock";
import { Loader2 } from "lucide-react";
import { useNewsById } from "@/hooks/useNews";
import { useContentsByNewsId } from "@/hooks/useContent";
import { FeedForm } from "@/components/feed/form/FeedForm";
import { useMediaByNewsId } from "@/hooks/useMedia";

export default function EditFeedPage() {
  const { id } = useParams();
  const newsId = Number(id);

  const { data: news, isLoading: newsLoading } = useNewsById(newsId);
  const { data: contents, isLoading: contentsLoading } = useContentsByNewsId(newsId);
  const { data: medias, isLoading: mediaLoading} = useMediaByNewsId(newsId);

  const [initialValues, setInitialValues] = useState<CreateNewsModel>();
  const [initialBlocks, setInitialBlocks] = useState<Block[]>([]);
  
  useEffect(() => {
    if (news) {
      setInitialValues({
        title: news.title,
        category: news.category,
        priority: news.priority,
        tags: news.tags || [],
      });
    }
  }, [news]);

useEffect(() => {
  if ((contents && contents.length > 0) || (medias && medias.length > 0)) {
    const textBlocks: Block[] = (contents || []).map((content) => ({
      id: content.id,
      type: TypeBlock.TEXT,
      order: content.order,
      content: content.content,
    }));

    const mediaBlocks: Block[] = (medias || []).map((media) => ({
      id: media.id,
      type: TypeBlock.MEDIA,
      order: media.order ?? 0,
      files: [],
      existingMedias: [media] 
    }));

    const allBlocks = [...textBlocks, ...mediaBlocks].sort((a, b) => a.order - b.order);

    setInitialBlocks(allBlocks);
  }
}, [contents, medias]);

return (
  <>
    {(newsLoading || contentsLoading || mediaLoading) && (
      <main className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Chargement...</span>
        </div>
      </main>
    )}

    {!news && !newsLoading && (
      <main className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Actualité introuvable</p>
        </div>
      </main>
    )}

    {news && !newsLoading && !contentsLoading && !mediaLoading && (
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modifier l&apos;actualité</h1>
          <p className="text-gray-600 mt-2">Modifiez les informations et le contenu de votre actualité</p>
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