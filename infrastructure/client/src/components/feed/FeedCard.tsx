import { News } from "@/types/news";

interface FeedCardProps {
    news: News;
}

export function FeedCard({ news }: FeedCardProps) {
    return (
        <article className="border p-4 rounded-2xl shadow-sm bg-white hover:shadow-md transition">
            <h2 className="text-xl font-semibold">{news.title}</h2>
            
            <p className="text-sm text-gray-500 mb-2">
                Catégorie : <strong>{news.category}</strong> • Priorité :{" "}
                <strong>{news.priority}</strong>   
            </p>

            <p className="text-gray-700 mb-4">{news.content}</p>
            
            {news.images && news.images?.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {news.images.map((img, i) => (
                        <img key={i} src={img} alt={`image-${i}`} className="rounded" />
                    ))}
                </div>
            )}

            {news.videos && news.videos?.length > 0 && (
                <div className="mt-2">
                    {news.videos.map((vid, i) => (
                        <video key={i} src={vid} controls className="rounded w-full mb-2" />
                    ))}
                </div>
            )}

            <div className="flex justify-between text-xs text-gray-400">
                <span>Vues : {news.views}</span>
                <span>Publié le : {new Date(news.createdAt).toLocaleDateString()}</span>
            </div>
        </article>
    )
}