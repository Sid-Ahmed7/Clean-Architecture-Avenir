import { Content } from "@/types/content";

interface FeedContentProps {
    content: Content;
}

export function FeedContent({content} : FeedContentProps) {
    const paragraphs = content.content.split('\n\n').filter(p => p.trim());

    return (
        <article className="prose prose-lg md:prose-xl max-w-none">
            {paragraphs.map((paragraph, index) => (
                <p
                    key={index}
                    className={`text-gray-700 leading-relaxed break-words ${
                        index === 0
                            ? 'text-xl md:text-2xl text-gray-800 font-light first-letter:text-7xl first-letter:font-bold first-letter:text-transparent first-letter:bg-clip-text first-letter:bg-gradient-to-br first-letter:from-blue-600 first-letter:to-indigo-600 first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8]'
                            : 'mt-6 text-lg'
                    }`}
                >
                    {paragraph}
                </p>
            ))}
        </article>
    )
}
