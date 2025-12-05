import { Content } from "@/types/content";

interface FeedContentProps {
    content: Content;
}

export function FeedContent({content} : FeedContentProps) {
const paragraphs = content.content.split('\n\n').filter(p => p.trim());

    return (
<div className="prose prose-xl max-w-none">
            {paragraphs.map((paragraph, index) => (
                <p 
                    key={index}
                    className={`text-gray-700 text-lg leading-relaxed break-words ${
                        index === 0 
                            ? 'text-gray-800 text-xl first-letter:text-7xl first-letter:font-bold first-letter:text-gray-900 first-letter:mr-3 first-letter:float-left first-letter:leading-none' 
                            : 'mt-6'
                    }`}
                >
                    {paragraph}
                </p>
            ))}
        </div>
    )
}