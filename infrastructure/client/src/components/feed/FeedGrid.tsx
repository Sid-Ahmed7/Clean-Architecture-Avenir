import { News } from "@/types/news";
import { FeedCardWithMedia } from "./FeedCardWithMedia";

interface FeedGridProps {
    allNews: News[]
}
export function FeedGrid({ allNews }: FeedGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allNews.length === 0 ? (
                <p className="text-gray-500 text-center col-span-full">
                    Aucune actualité trouvé.
                </p>
            ) : (
                allNews.map((n) => <FeedCardWithMedia key={n.id} news={n} />)
            )}
        </div>
    );
}
