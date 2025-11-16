import { getMediaUrl } from "@/lib/utils/media";
import { Media } from "@/types/media";
import { News } from "@/types/news";
import { ImageIcon, Video } from "lucide-react";
import { useEffect } from "react";

interface FeedCardProps {
    news: News;
    media?: Media[];
}

export function FeedCard({ news, media }: FeedCardProps) {
    return (
        <article className="border p-4 rounded-2xl shadow-sm bg-white hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
            
            <p className="text-sm text-gray-500 mb-2">
                Catégorie : <strong>{news.category}</strong> • Priorité :{" "}
                <strong>{news.priority}</strong>   
            </p>

            <p className="text-gray-700 mb-4">{news.content}</p>
            
            {media && media.length > 0 && (
                <div className="mb-4">
                    {media.length === 1 ? (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                            {media[0].type === "IMAGE" ? (
                                <img src={getMediaUrl(media[0].url)} alt={media[0].altIndex || news.title} className="object-cover" />
                            ) : (
                                <video src={getMediaUrl(media[0].url)} controls className="w-full h-full object-cover"/>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2">
                            {media.slice(0, 4).map((item) => (
                                <div 
                                    key={item.id} 
                                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                                >
                                    {item.type === "IMAGE" ? (
                                        <img src={getMediaUrl(item.url)} alt={item.altIndex || news.title} className="object-cover"/>
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <video 
                                                src={getMediaUrl(item.url)} 
                                    className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                                                <Video className="text-white" size={32} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {media.length > 4 && (
                                <div className="col-span-2 text-center text-sm text-gray-500 py-2">
                                    +{media.length - 4} autre(s) média(s)
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-400 mt-4">
                <div className="flex items-center gap-4">
                    <span>👁️ {news.views} vue{news.views > 1 ? 's' : ''}</span>
                    {media && media.length > 0 && (
                        <span className="flex items-center gap-1">
                            <ImageIcon size={14} />
                            {media.length} média(s)
                        </span>
                    )}
                </div>
                <span>📅 {new Date(news.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
        </article>
    );

}