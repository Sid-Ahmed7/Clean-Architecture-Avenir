import { NewsFilters } from "@/types/filtersNews";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
          return { data: [], nextPage: undefined, error: t('generalErrors.news.validation')}
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
            error: err.response?.data?.error || err.message || t('generalErrors.news.unknown')
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

export const useNewsById =(newsId: string) => {
  const t = useTranslations();

  return useQuery<News | null>({
    queryKey: [NEWS_QUERY_KEY, newsId],
    queryFn: async () => {
      const getNews = await newsApi.getNewsById(newsId);

      if(!getNews) {
        return null;
      }

      const parsed = newsSchema(t).safeParse(getNews);
      if(!parsed.success) {
        return null;
      }
      return parsed.data;
    }, enabled: !!newsId,
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
          error: err.response?.data?.error || err.message || t('generalErrors.news.create')
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


  const deleteNews = useMutation<{ success: boolean; error: string | null },Error,string>({
    mutationFn: async (newsId) => {
      try {
        await newsApi.deleteNews(newsId);
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

   return {
    createNews,
    updateNews,
    deleteNews
   };
  
}