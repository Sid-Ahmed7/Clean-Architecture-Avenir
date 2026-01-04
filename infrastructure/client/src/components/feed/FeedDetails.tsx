"use client"
import { useTranslations } from "next-intl";
import { Content } from "@/types/content";
import { DisplayBlock } from "@/types/displayBlock";
import { Media } from "@/types/media";
import { News } from "@/types/news";
import { FeedHeader } from "./structure/FeedHeader";
import { FeedContent } from "./structure/FeedContent";
import { FeedMedia } from "./structure/FeedMedia";
import { sortBlock } from "@/lib/utils/blocksUtils";

interface FeedDetailProps {
    news: News;
    contents: Content[];
    medias: Media[];
}                             

export function FeedDetail({news, contents, medias} : FeedDetailProps) {
    const t = useTranslations('components.feed.details');

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

    console.log("Blocks créés:", blocks);

    const orderedContent = sortBlock(blocks);


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
                            {t('noContent')}
                        </p>
                    </div>
                )}
            </article>
        </main>
    );
}