import { News } from "@/types/news";
import { useEffect, useState } from "react";

export const useNewsSSE = (initialNews: News[]) => {
    const [news, setNews] = useState<(News[])>(initialNews);
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const eventSource = new EventSource(`${baseURL}/feed/stream`);

        eventSource.addEventListener("new_feed", (event: MessageEvent) => {
            const newNews: News = JSON.parse(event.data);
            setNews(prev => [newNews, ...prev]);
        });

        eventSource.addEventListener("update_feed", (event: MessageEvent) => {
            const updatedNews: News = JSON.parse(event.data);
            setNews(prev => prev.map(n => n.id === updatedNews.id ? updatedNews : n));
        });

        eventSource.addEventListener("delete_feed", (event: MessageEvent) => {
            const deleted = JSON.parse(event.data);
            setNews(prev => prev.filter(n => n.id !== deleted.id));
        });

    return () => eventSource.close();

    }, [baseURL]);
    return {news, setNews};
}