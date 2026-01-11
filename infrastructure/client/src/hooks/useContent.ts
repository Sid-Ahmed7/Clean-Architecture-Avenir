import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as contentApi from "@/lib/api/news/client/content";
import z from "zod";
import { Content } from "@/types/content";
import { CreateContent } from "@/types/createContent";
import { UpdateContent } from "@/types/updateContent";
import { useTranslations } from "next-intl";
import { contentSchema } from "@/lib/validation/content/contentSchema";

export const CONTENT_QUERY_KEY = "content";

export const useContentsByNewsId = (newsId: string) => {
  const t = useTranslations();

  return useQuery<Content[]>({
    queryKey: [CONTENT_QUERY_KEY, "news", newsId],
    queryFn: async () => {
      try {
        const fetchContents = await contentApi.getContentsByNewsId(newsId);
        const parsed = z.array(contentSchema(t)).safeParse(fetchContents);
        if (!parsed.success) {
          console.error(t('generalErrors.content.notFound'), parsed.error);
          return [];
        }
        return parsed.data;
      } catch (err: any) {
        console.error(t('generalErrors.content.notFound'), err);
        return [];
      }
    },
    enabled: !!newsId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useContentById = (contentId: string) => {
  const t = useTranslations();

  return useQuery<Content | null>({
    queryKey: [CONTENT_QUERY_KEY, contentId],
    queryFn: async () => {
      try {
        const fetchContents = await contentApi.getContentsId(contentId);
        const parsed = contentSchema(t).safeParse(fetchContents);
        if (!parsed.success) {
          console.error(t('generalErrors.content.notFound'), parsed.error);
          return null;
        }
        return parsed.data;
      } catch (err: any) {
        console.error(t('generalErrors.content.notFound'), err);
        return null;
      }
    },
    enabled: !!contentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useContentMutations = () => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const createContent = useMutation<{ data: Content[] | null; error: string | null },Error,CreateContent>({
    mutationFn: async (content) => {
      try {
        const newContents = await contentApi.createContent(content);
        const parsed = contentSchema(t).safeParse(newContents);
        if (!parsed.success) {
          return {
            data: null,
            error: t('generalErrors.content.create')
          };
        }
        
        return { data: newContents, error: null };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || t('generalErrors.content.create')
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData([CONTENT_QUERY_KEY, "news", variables.newsId], result.data);
      }
    },
  });

  const updateContent = useMutation<{ data: Content | null; error: string | null },Error,UpdateContent>({
    mutationFn: async (content) => {
      try {
        const updatedContents = await contentApi.updateContent(content);
        const parsed = contentSchema(t).safeParse(updatedContents);
         if (!parsed.success) {
          return {
            data: null,
            error: t('generalErrors.content.update')
          };
        }
        return { data: updatedContents, error: null };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || t('generalErrors.content.update')
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData([CONTENT_QUERY_KEY, variables.id], result.data);
              queryClient.setQueryData<Content[]>([CONTENT_QUERY_KEY, "news", variables.newsId], (old) => {
        if (!old) return old;
        return old.map(c => c.id === variables.id ? result.data! : c);
      });
      }
    },
  });

  const deleteContent = useMutation<{ success: boolean; error: string | null },Error,{ contentId: string; newsId: string }>({
    mutationFn: async ({ contentId }) => {
      try {
        await contentApi.deleteContent(contentId);
        return { success: true, error: null };
      } catch (err: any) {
        return {
          success: false,
          error: err.response?.data?.error || err.message || t('generalErrors.content.delete')
        };
      }
    },
    onSuccess: (result, { contentId, newsId }) => {
      if (result.success) {
        queryClient.removeQueries({ queryKey: [CONTENT_QUERY_KEY, contentId] });
        queryClient.setQueryData<Content[]>([CONTENT_QUERY_KEY, "news", newsId], (old) =>
          old ? old.filter((c) => c.id !== contentId) : []
        );
      }
    },
  });

  const reorderContents = useMutation<{ data: Content[] | null; error: string | null },Error,{ newsId: string; newOrder: string[] }>({
    mutationFn: async ({ newsId, newOrder }) => {
      try {
        const reorderedContents = await contentApi.reorderContents(newsId, newOrder);
        return { data: reorderedContents, error: null };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || t('generalErrors.content.update')
        };
      }
    },
    onSuccess: (result, { newsId }) => {
      if (result.data) {
        queryClient.setQueryData([CONTENT_QUERY_KEY, "news", newsId], result.data);
      }
    },
  });

  return {
    createContent,
    updateContent,
    deleteContent,
    reorderContents,
  };
};