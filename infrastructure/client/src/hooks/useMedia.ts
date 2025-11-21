import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as mediaApi from "@/lib/api/news/client/media";
import { Media } from "@/types/media";

export const MEDIA_QUERY_KEY = "media";

export const useMediaByNewsId = (newsId: number) => {
  return useQuery<Media[]>({
    queryKey: [MEDIA_QUERY_KEY, "news", newsId],
    queryFn: async () => {
      try {
        return await mediaApi.getMediaByNewsId(newsId);
      } catch (err: any) {
        console.error("Erreur lors du chargement des médias:", err);
        return [];
      }
    },
    enabled: !!newsId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useMediaMutations = () => {
  const queryClient = useQueryClient();

  const uploadMedia = useMutation<{ data: Media | null; error: string | null },Error,{ file: File; newsId: number; altText?: string }>({
    mutationFn: async ({ file, newsId, altText }) => {
      try {
        const uploaded = await mediaApi.uploadMedia(file, newsId, altText);
        return { data: uploaded, error: null };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || "Erreur lors de l'upload"
        };
      }
    },
    onSuccess: (result, { newsId }) => {
      if (result.data) {
        queryClient.setQueryData<Media[]>([MEDIA_QUERY_KEY, "news", newsId], (old) =>
          old ? [...old, result.data!] : [result.data!]
        );
      }
    },
  });


  const deleteMedia = useMutation<{ success: boolean; error: string | null },Error,{ mediaId: number; newsId: number }>({
    mutationFn: async ({ mediaId }) => {
      try {
        await mediaApi.deleteMedia(mediaId);
        return { success: true, error: null };
      } catch (err: any) {
        return {
          success: false,
          error: err.response?.data?.error || err.message || "Erreur lors de la suppression"
        };
      }
    },
    onSuccess: (result, { mediaId, newsId }) => {
      if (result.success) {
        queryClient.setQueryData<Media[]>([MEDIA_QUERY_KEY, "news", newsId], (old) =>
          old ? old.filter((m) => m.id !== mediaId) : []
        );
      }
    },
  });

  return {
    uploadMedia,
    deleteMedia,
  };
}