import * as mediaApi from "@/lib/api/news/client/media";
import { Media } from "@/types/media";
import { useCallback, useState } from "react";

export const useMedia = (initialMedia: Media[] = []) => {
  const [mediaList, setMediaList] = useState<Media[]>(initialMedia);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaByNewsId = useCallback((newsId: number) => {
    setLoading(true);
    setError(null);

    return mediaApi.getMediaByNewsId(newsId)
      .then((fetched) => {
        setMediaList(fetched);
        return fetched;
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || "Erreur inconnue");
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const uploadMedia = useCallback((file: File, newsId: number, altText?: string) => {
    setLoading(true);
    setError(null);

    return mediaApi.uploadMedia(file, newsId, altText)
      .then((uploaded) => {
        setMediaList((prev) => [...prev, uploaded]);
        return uploaded;
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || "Erreur lors de l'upload");
        return null;
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const deleteMedia = useCallback((mediaId: number) => {
    setLoading(true);
    setError(null);

    return mediaApi.deleteMedia(mediaId)
      .then(() => {
        setMediaList((prev) => prev.filter((m) => m.id !== mediaId));
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || "Erreur lors de la suppression");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { mediaList, fetchMediaByNewsId, uploadMedia, deleteMedia, loading, error, setMediaList };
};
