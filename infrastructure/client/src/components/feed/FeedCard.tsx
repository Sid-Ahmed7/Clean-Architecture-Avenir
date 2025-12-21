"use client";
import { categoryColors, priorityColors } from "@/constants/colors";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { getMediaUrl, sortMedia } from "@/lib/utils/media";
import { Media } from "@/types/media";
import { News } from "@/types/news";
import { Calendar, Eye, ImageIcon, Video } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";

interface FeedCardProps {
    news: News;
    media?: Media[];
}

export function FeedCard({ news, media }: FeedCardProps) {

    const router = useRouter();
    const {locale} = useContext(LocaleContext);
    const sortedMedia = sortMedia(media);

    const handleClick = () => {
        router.push(`/${locale}/feed/${news.id}`);
    }
    return (
        <article 
            className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100" 
            onClick={handleClick}
        >
            {sortedMedia && sortedMedia.length > 0 && (
                <div className="relative h-72 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    {sortedMedia.length === 1 ? (
                        <>
                            {sortedMedia[0].type === "IMAGE" ? (
                                <Image 
                                    src={getMediaUrl(sortedMedia[0].url)} 
                                    alt={sortedMedia[0].altText} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    width={800} 
                                    height={288} 
                                    sizes="(max-width: 768px) 100vw, 50vw" 
                                    loading="lazy" 
                                    unoptimized 
                                />
                            ) : (
                                <div className="relative w-full h-full">
                                    <video 
                                        src={getMediaUrl(sortedMedia[0].url)} 
                                        className="w-full h-full object-cover" 
                                        preload="metadata"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                                            <Video className="w-8 h-8 text-gray-900" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-1 p-1 h-full">
                            {sortedMedia.slice(0, 4).map((item) => (
                                <div 
                                    key={item.id} 
                                    className="relative rounded-lg overflow-hidden bg-gray-100"
                                >
                                    {item.type === "IMAGE" ? (
                                        <Image 
                                            src={getMediaUrl(item.url)} 
                                            alt={item.altText} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            width={400} 
                                            height={400} 
                                            sizes="(max-width: 768px) 50vw, 25vw" 
                                            loading="lazy" 
                                            unoptimized 
                                        />
                                    ) : (
                                        <div className="relative w-full h-full">
                                            <video 
                                                src={getMediaUrl(item.url)} 
                                                className="w-full h-full object-cover"
                                                preload="metadata"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                                                    <Video className="w-6 h-6 text-gray-900" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 shadow-md flex items-center gap-1.5">
                        <ImageIcon size={12} />
                        {sortedMedia.length} média{sortedMedia.length > 1 ? 's' : ''}
                    </div>
                    
                    {sortedMedia.length > 4 && (
                        <div className="absolute bottom-2 left-2 right-2 text-center text-sm font-medium text-gray-700 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md">
                            +{sortedMedia.length - 4} autre{sortedMedia.length - 4 > 1 ? 's' : ''} média{sortedMedia.length - 4 > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            )}

            <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${categoryColors[news.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}>
                        {news.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${priorityColors[news.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'}`}>
                        {news.priority}
                    </span>
                </div>

                <h2 className="text-2xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {news.title}
                </h2>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <span className="flex items-center gap-1.5 font-medium">
                        <Calendar size={16} />
                        {new Date(news.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                </div>

                {news.tags && news.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {news.tags.slice(0, 3).map((tag) => (
                            <span 
                                key={tag}
                                className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors"
                            >
                                #{tag}
                            </span>
                        ))}
                        {news.tags.length > 3 && (
                            <span className="text-xs text-gray-400 px-2 py-1.5 font-medium">
                                +{news.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}