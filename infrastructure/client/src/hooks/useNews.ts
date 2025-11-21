import { NewsFilters } from "@/types/filtersNews";
import { useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import * as newsApi from "@/lib/api/news/client/news";
import z from "zod";
import { newsSchema } from "@/lib/validation/news/newsSchema";
import { News } from "@/types/news";
import { CreateNews } from "@/types/createNews";

export const NEWS_QUERY_KEY = "news";

export const useNewsInfinite =(filters: NewsFilters = {}, limit: number = 10) => {
  const t = useTranslations();

  return useInfiniteQuery({
    queryKey: [NEWS_QUERY_KEY, "infinite", filters, limit],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const fetchedAllNews = await newsApi.getAllNews({ ...filters, page: pageParam, limit });
        const parsed = z.array(newsSchema(t)).safeParse(fetchedAllNews);
        if(!parsed.success) {
          return { data: [], nextPage: undefined, error: "Erreur de validation des news"}
        }
        return {
          data: parsed.data,
          nextPage: parsed.data.length === limit ? pageParam + 1 : undefined,
          error: null
        };
      } catch(err: any) {
          return {
            data: [],
            nextPage: undefined,
            error: err.response?.data?.error || err.message || "Erreur inconnue"
          };
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    retry: 1
  });
};

export const useAllNews = (filters: NewsFilters) => {
  const t = useTranslations();

  return useQuery<News[]>({
    queryKey: [NEWS_QUERY_KEY, "all", filters],
    queryFn: async () => {
      const getAllNews = await newsApi.getAllNews(filters);
      const parsed = z.array(newsSchema(t)).safeParse(getAllNews);
      if(!parsed.success) {
        return [];
      }
      return parsed.data;
    }, staleTime: 5 *60*1000
  })
}

export const useNewsById =(id:number) => {
  const t = useTranslations();

  return useQuery<News | null>({
    queryKey: [NEWS_QUERY_KEY, id],
    queryFn: async () => {
      const getNews = await newsApi.getNewsById(id);

      if(!getNews) {
        return null;
      }

      const parsed = newsSchema(t).safeParse(getNews);
      if(!parsed.success) {
        return null;
      }
      return parsed.data;
    }, enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
};

export const useNewsMutation = () => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const createNews = useMutation<{data: News |null; error: string | null}, Error, CreateNews>({
    mutationFn: async (news) => {
      try {
        const created = await newsApi.createNews(news);
        const parsed = newsSchema(t).safeParse(created);
         if (!parsed.success) {
          return {
            data: null,
            error: "Erreur de validation lors de la création"
          }
      }
        return {
          data: parsed.data,
          error: null
        };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || "Erreur lors de la création"
        };
      }
    },
    onSuccess: (result) => {
      if(result.data) {
         queryClient.invalidateQueries({ queryKey: [NEWS_QUERY_KEY, "all"] });
        queryClient.invalidateQueries({ queryKey: [NEWS_QUERY_KEY, "infinite"] });
        queryClient.setQueryData([NEWS_QUERY_KEY, result.data.id], result.data);
      }
    }
  })


  const updateNews = useMutation<{data: News | null; error: string | null}, Error,News>({
    mutationFn: async (news) => {
      try {
        const updated = await newsApi.updateNews(news);
        const parsed = newsSchema(t).safeParse(updated);
         if (!parsed.success) {
          return {
            data: null,
            error: "Erreur de validation lors de la modification"
          }
      }
        return {
          data: parsed.data,
          error: null
        };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || "Erreur lors de la modification"
        };
      }
    },
    onSuccess: (result) => {
      if(result.data) {
        queryClient.setQueryData([NEWS_QUERY_KEY, result.data.id], result.data);
        queryClient.invalidateQueries({ queryKey: [NEWS_QUERY_KEY, "all"] });
        queryClient.invalidateQueries({ queryKey: [NEWS_QUERY_KEY, "infinite"] });
      }
    }
  })


  const deleteNews = useMutation<{ success: boolean; error: string | null },Error,number>({
    mutationFn: async (id) => {
      try {
        await newsApi.deleteNews(id);
        return { success: true, error: null };
      } catch (err: any) {
        return {
          success: false,
          error: err.response?.data?.error || err.message || "Erreur lors de la suppression"
        };
      }
    },
    onSuccess: (result, deletedId) => {
      if (result.success) {
        queryClient.removeQueries({ queryKey: [NEWS_QUERY_KEY, deletedId] });
        

        queryClient.invalidateQueries({ queryKey: [NEWS_QUERY_KEY, "all"] });
        queryClient.invalidateQueries({ queryKey: [NEWS_QUERY_KEY, "infinite"] });
      }
    },
  });

  const incrementViews = useMutation<{ data: News | null; error: string | null },Error,number,{ previousNews: News | undefined }>({
    mutationFn: async (id) => {
      try {
        const updated = await newsApi.incrementNewsViews(id);
        const parsed = newsSchema(t).safeParse(updated);
        
        if (!parsed.success) {
          return {
            data: null,
            error: "Erreur de validation lors de l'incrémentation des vues"
          };
        }
        
        return {
          data: parsed.data,
          error: null
        };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || "Erreur inconnue"
        };
      }
    },
    onMutate: async (newsId) => {
      await queryClient.cancelQueries({ queryKey: [NEWS_QUERY_KEY, newsId] });
      
      const previousNews = queryClient.getQueryData<News>([NEWS_QUERY_KEY, newsId]);
      
      if (previousNews) {
        queryClient.setQueryData<News>([NEWS_QUERY_KEY, newsId], {
          ...previousNews,
          views: previousNews.views + 1,
        });
      }
      
      return { previousNews };
    },
    onError: (err, newsId, context) => {
      if (context?.previousNews) {
        queryClient.setQueryData([NEWS_QUERY_KEY, newsId], context.previousNews);
      }
    },
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData([NEWS_QUERY_KEY, result.data.id], result.data);
      }
    },
  });

  return {
    createNews,
    updateNews,
    deleteNews,
    incrementViews,
  };
  
}