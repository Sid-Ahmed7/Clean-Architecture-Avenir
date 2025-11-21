import { News } from "@/types/news";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { NEWS_QUERY_KEY } from "./useNews";


interface Data {
    pages: Array<{
        data: News[];
        nextPage?: number;
        error: string | null;
    }>
}

export const useNewsSSE = () => {
    const queryClient = useQueryClient();
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const eventSource = new EventSource(`${baseURL}/feed/stream`, { withCredentials: true });

        eventSource.addEventListener("new_feed", (event: MessageEvent) => {
            const newNews: News = JSON.parse(event.data);
            queryClient.setQueryData([NEWS_QUERY_KEY, newNews.id], newNews);
            queryClient.setQueriesData<News[]>(
                {queryKey: [NEWS_QUERY_KEY, "all"]},
            (old) => (old ?[newNews, ...old] : [newNews]))
            queryClient.invalidateQueries({
                queryKey: [NEWS_QUERY_KEY, "infinite"],
            });
        });

        eventSource.addEventListener("update_feed", (event: MessageEvent) => {
            const updatedNews: News = JSON.parse(event.data);
            queryClient.setQueryData([NEWS_QUERY_KEY, updatedNews.id], updatedNews);
            queryClient.setQueriesData<News[]>(
                {queryKey: [NEWS_QUERY_KEY, "all"]},
            (old) => (old?.map((n) => (n.id === updatedNews.id ? updatedNews : n))))
            queryClient.setQueriesData<Data>(
                { queryKey: [NEWS_QUERY_KEY, "infinite"] },
                (old) => {
                    if (!old?.pages) return old;
                        return {
                            ...old,
                            pages: old.pages.map((page) => ({
                            ...page,
                            data: page.data.map((n: News) => n.id === updatedNews.id ? updatedNews : n),
            })),
          };
        }
      );
    });

        eventSource.addEventListener("delete_feed", (event: MessageEvent) => {
            const deleted = JSON.parse(event.data);
        queryClient.setQueryData([NEWS_QUERY_KEY, deleted.id], deleted);
            queryClient.setQueriesData<News[]>(
                {queryKey: [NEWS_QUERY_KEY, "all"]},
            (old) => (old?.map((n) => (n.id === deleted.id ? deleted : n))))
            queryClient.setQueriesData<Data>(
                { queryKey: [NEWS_QUERY_KEY, "infinite"] },
                (old) => {
                    if (!old?.pages) return old;
                        return {
                            ...old,
                            pages: old.pages.map((page) => ({
                            ...page,
                            data: page.data.map((n: News) => n.id === deleted.id ? deleted : n),
            })),
          };
        }
      );
    });

    return () => eventSource.close();

    }, [baseURL, queryClient]);
}