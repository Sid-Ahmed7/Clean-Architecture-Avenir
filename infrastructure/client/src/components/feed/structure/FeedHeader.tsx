import { categoryColors, priorityColors } from "@/constants/colors";
import { News } from "@/types/news";
interface FeedHeaderProps {
    news: News;
}

export function FeedHeader({news} : FeedHeaderProps) {

    return (
             <header className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${categoryColors[news.category]}`}>
                        {news.category}
                    </span>
                    <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                    <time className="text-sm text-gray-500 font-medium" dateTime={news.createdAt}>
                        {new Date(news.createdAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                        })}
                    </time>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${priorityColors[news.priority]}`}>
                    {news.priority}
                </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-snug">
                {news.title}
            </h1>

            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                
                {news.tags && news.tags.length > 0 && (
                    <div className="flex gap-2">
                        {news.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </header>
    )
}