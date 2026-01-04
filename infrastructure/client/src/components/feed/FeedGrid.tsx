import { News } from "@/types/news";
import { FeedCardWithMedia } from "./FeedCardWithMedia";
import { useTranslations } from "next-intl";

interface FeedGridProps {
    allNews: News[]
}
export function FeedGrid({ allNews }: FeedGridProps) {
    const t = useTranslations('components.feed.grid');
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allNews.length === 0 ? (
                <p className="text-gray-500 text-center col-span-full">
                    {t('noNews')}
                </p>
            ) : (
                allNews.map((n) => <FeedCardWithMedia key={n.id} news={n} />)
            )}
        </div>
    );
}
