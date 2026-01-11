import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as mediaApi from "@/lib/api/news/client/media";
import { Media } from "@/types/media";
import { mediaSchema } from "@/lib/validation/media/mediaSchema";
import z from "zod";
import { useTranslations } from "next-intl";

export const MEDIA_QUERY_KEY = "media";

export const useMediaByNewsId = (newsId: string) => {
    const t = useTranslations();
  
  return useQuery<Media[]>({
    queryKey: [MEDIA_QUERY_KEY, "news", newsId],
    queryFn: async () => {
      try {
        const medias =  await mediaApi.getMediaByNewsId(newsId);
        const parsed = z.array(mediaSchema(t)).safeParse(medias);
        if(!parsed.success) {
          return [];
        }
        return parsed.data;        
      } catch (err: any) {
        console.error(t('generalErrors.media.load'), err);
        return [];
      }
    },
    enabled: !!newsId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useMediaMutations = () => {
    const t = useTranslations();

  const queryClient = useQueryClient();

  const uploadMedia = useMutation<{ data: Media | null; error: string | null },Error,{ file: File; newsId: string;}>({
    mutationFn: async ({ file, newsId}) => {
      try {
        const uploaded = await mediaApi.uploadMedia(file, newsId);
        const parsed = mediaSchema(t).safeParse(uploaded);

        if (!parsed.success) {
          return {
            data: null,
            error: t('generalErrors.media.validation'),
         };
        }
        return {data: parsed.data, error: null};
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || t('generalErrors.media.upload')
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
  const updateMedia = useMutation<{ data: Media | null; error: string | null }, Error, { media: Media; newsId: string }>({
    mutationFn: async ({ media }) => {
      try {
        const updated = await mediaApi.updateMedia(media);
        const parsed = mediaSchema(t).safeParse(updated);
        if (!parsed.success) {
          return { data: null, error: t('generalErrors.media.validation') };
        }
        return { data: parsed.data, error: null };
      } catch (err: any) {
        return {
          data: null,
          error: err.response?.data?.error || err.message || t('generalErrors.media.update'),
        };
      }
    },
    onSuccess: (result, { media, newsId }) => {
      if (result.data) {
        queryClient.setQueryData<Media[]>(
          [MEDIA_QUERY_KEY, "news", newsId],
          (old) => (old ? old.map((m) => (m.id === media.id ? result.data! : m)) : [result.data!])
        );
      }
    },
  });


  const deleteMedia = useMutation<{ success: boolean; error: string | null },Error,{ mediaId: string; newsId: string }>({
    mutationFn: async ({ mediaId }) => {
      try {
        await mediaApi.deleteMedia(mediaId);
        return { success: true, error: null };
      } catch (err: any) {
        return {
          success: false,
          error: err.response?.data?.error || err.message || t('generalErrors.media.delete')
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
    updateMedia,
    deleteMedia,
  };
  };
