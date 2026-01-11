import { categoryColors, priorityColors } from "@/constants/colors";
import { News } from "@/types/news";
import { Calendar, Tag } from "lucide-react";

interface FeedHeaderProps {
    news: News;
}

export function FeedHeader({news} : FeedHeaderProps) {

    return (
        <header className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${categoryColors[news.category]}`}>
                        {news.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${priorityColors[news.priority]}`}>
                        {news.priority}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <time className="text-sm font-medium" dateTime={news.createdAt}>
                        {new Date(news.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </time>
                </div>
            </div>

            <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    {news.title}
                </h1>
            </div>

            {news.tags && news.tags.length > 0 && (
                <div className="mt-8 flex items-center gap-3 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <div className="flex gap-2 flex-wrap">
                        {news.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-200"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </header>
    )
}