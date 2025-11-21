import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as contentApi from "@/lib/api/news/client/content";
import { Content } from "@/types/content";
import { CreateContent } from "@/types/createContent";
import { UpdateContent } from "@/types/updateContent";

export const CONTENT_QUERY_KEY = "content";

export const useContentsByNewsId = (newsId: number) => {
  return useQuery<Content[]>({
    queryKey: [CONTENT_QUERY_KEY, "news", newsId],
    queryFn: async () => {
      try {
        return await contentApi.getContentsByNewsId(newsId);
      } catch (err: any) {
        console.error("Erreur lors du chargement des contenus:", err);
        return [];
      }
    },
    enabled: !!newsId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useContentById = (id: number) => {
  return useQuery<Content | null>({
    queryKey: [CONTENT_QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await contentApi.getContentsId(id);
      } catch (err: any) {
        console.error("Erreur lors du chargement du contenu:", err);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useContentMutations = () => {
  const queryClient = useQueryClient();

  const createContent = useMutation<{ data: Content[] | null; error: string | null },Error,CreateContent>({
    mutationFn: async (content) => {
      try {
        const newContents = await contentApi.createContent(content);
        return { data: newContents, error: null };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || "Erreur lors de la création"
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData([CONTENT_QUERY_KEY, "news", variables.newsId], result.data);
      }
    },
  });

  const updateContent = useMutation<{ data: Content[] | null; error: string | null },Error,UpdateContent>({
    mutationFn: async (content) => {
      try {
        const updatedContents = await contentApi.updateContent(content);
        return { data: updatedContents, error: null };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || "Erreur lors de la mise à jour"
        };
      }
    },
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData([CONTENT_QUERY_KEY, variables.id], result.data.find(c => c.id === variables.id));
        queryClient.setQueryData([CONTENT_QUERY_KEY, "news", variables.newsId], result.data);
      }
    },
  });

  const deleteContent = useMutation<{ success: boolean; error: string | null },Error,{ id: number; newsId: number }>({
    mutationFn: async ({ id }) => {
      try {
        await contentApi.deleteContent(id);
        return { success: true, error: null };
      } catch (err: any) {
        return {
          success: false,
          error: err.response?.data?.error || err.message || "Erreur lors de la suppression"
        };
      }
    },
    onSuccess: (result, { id, newsId }) => {
      if (result.success) {
        queryClient.removeQueries({ queryKey: [CONTENT_QUERY_KEY, id] });
        queryClient.setQueryData<Content[]>([CONTENT_QUERY_KEY, "news", newsId], (old) =>
          old ? old.filter((c) => c.id !== id) : []
        );
      }
    },
  });

  const reorderContents = useMutation<{ data: Content[] | null; error: string | null },Error,{ newsId: number; newOrder: number[] }>({
    mutationFn: async ({ newsId, newOrder }) => {
      try {
        const reorderedContents = await contentApi.reorderContents(newsId, newOrder);
        return { data: reorderedContents, error: null };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || "Erreur lors de la réorganisation"
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