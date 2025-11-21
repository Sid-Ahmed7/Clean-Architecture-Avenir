"use client"
import { useNewsMutation } from "@/hooks/useNews";
import { Content } from "@/types/content";
import { DisplayBlock } from "@/types/displayBlock";
import { Media } from "@/types/media";
import { News } from "@/types/news";
import { useEffect } from "react";
import { FeedHeader } from "./structure/FeedHeader";
import { FeedContent } from "./structure/FeedContent";
import { FeedMedia } from "./structure/FeedMedia";

interface FeedDetailProps {
    news: News;
    contents: Content[];
    medias: Media[];
}                             

export  function FeedDetail({news, contents, medias} : FeedDetailProps) {
    const {incrementViews} = useNewsMutation();

    useEffect(() => {
        incrementViews.mutate(news.id);
    }, [news.id]);

    const blocks: DisplayBlock[] = [
        ...contents.map((content) => ({
            type: "content" as const,
            data: content,
            order: content.order ?? 0
        })),
        ...medias.map((media) => ({
            type: "media" as const,
            data: media,
            order: media.order ?? 0
        })),
    ];

    const orderedContent = blocks.sort((a,b) => a.order - b.order);

 return (
     <main className="min-h-screen bg-white py-16">
            <article className="container mx-auto px-4 max-w-3xl">
                <FeedHeader news={news} />

                {orderedContent.length > 0 ? (
                    <div className="space-y-8">
                        {orderedContent.map((block) => 
                            block.type === "content" ? (
                                <FeedContent
                                    key={`content-${block.data.id}`}
                                    content={block.data}
                                />
                            ) : (
                                <FeedMedia
                                    key={`media-${block.data.id}`}
                                    media={block.data}
                                />
                            )
                        )}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">
                            Aucun contenu disponible pour cette actualité.
                        </p>
                    </div>
                )}
            </article>
        </main>
  );
}