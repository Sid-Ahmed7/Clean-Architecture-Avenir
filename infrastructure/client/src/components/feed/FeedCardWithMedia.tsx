import { useMediaByNewsId } from "@/hooks/useMedia";
import { News } from "@/types/news";
import { FeedCard } from "./FeedCard";

interface FeedCardWithMediaProps {
    news: News
}

export function FeedCardWithMedia({news} : FeedCardWithMediaProps) {
    const {data: media} = useMediaByNewsId(news.id);
    return (
        <FeedCard news={news} media={media} />
    )
}