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
import { useMediaByNewsId } from "@/hooks/useMedia";
import { useContentsByNewsId } from "@/hooks/useContent";

interface FeedDetailProps {
    news: News;
    contents: Content[];
    medias: Media[];
}

export function FeedDetail({news, contents, medias} : FeedDetailProps) {
    const t = useTranslations('components.feed.details');

    const { data: mediasFromCache } = useMediaByNewsId(news.id);
    const { data: contentsFromCache } = useContentsByNewsId(news.id);

    const currentMedias = mediasFromCache ?? medias;
    const currentContents = contentsFromCache ?? contents;

    const blocks: DisplayBlock[] = [
        ...currentContents.map((content) => ({
            type: "content" as const,
            data: content,
            order: content.order ?? 0
        })),
        ...currentMedias.map((media) => ({
            type: "media" as const,
            data: media,
            order: media.order ?? 0
        })),
    ];

    console.log("Blocks créés:", blocks);

    const orderedContent = sortBlock(blocks);


    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
            <article className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="px-6 md:px-12 py-8 md:py-12">
                        <FeedHeader news={news} />

                        {orderedContent.length > 0 ? (
                            <div className="space-y-10">
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
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-lg font-medium">
                                    {t('noContent')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </main>
    );
}