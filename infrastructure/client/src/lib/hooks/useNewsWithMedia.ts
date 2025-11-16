import { useNews } from "./useNews";
import { useMedia } from "./useMedia";
import { News } from "@/types/news";
import { useState } from "react";
import { NewsWithMedia } from "@/types/newsWithMedia";
import { CreateNews } from "@/types/createNews";

export const useNewsWithMedia = (): NewsWithMedia => {
  const { createNews, updateNews } = useNews();
  const { uploadMedia } = useMedia();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewsWithMedia = (data: CreateNews, files: File[]): Promise<News | null> => {
    setIsSubmitting(true);
    setError(null);
    console.log("[NewsWithMedia] Creating news...", data);

    return createNews(data)
      .then((created) => {
        if (!created || !created.id) throw new Error("Échec de la création de la news");

        if (files.length === 0) return created; 

        const uploadPromises = files.map(file => {
          const altText = file.name.split(".")[0];
          return uploadMedia(file, created.id!, altText);
        });

        return Promise.all(uploadPromises)
          .then(() => created); 
      })
      .catch((err) => {
        console.error("[NewsWithMedia] Error:", err);
        setError(err.message || "Erreur lors de la création");
        return null;
      })
      .finally(() => setIsSubmitting(false));
  };

  const updateNewsWithMedia = (data: News, files: File[]): Promise<News | null> => {
    setIsSubmitting(true);
    setError(null);
    console.log("[NewsWithMedia] Updating news...", data);

    return updateNews(data)
      .then((updated) => {
        if (!updated || !updated.id) throw new Error("Échec de la mise à jour de la news");

        if (files.length === 0) return updated; 

        const uploadPromises = files.map(file => {
          const altText = file.name.split(".")[0];
          return uploadMedia(file, updated.id!, altText);
        });

        return Promise.all(uploadPromises)
          .then(() => updated); 
      })
      .catch((err) => {
        console.error("[NewsWithMedia] Error:", err);
        setError(err.message || "Erreur lors de la mise à jour");
        return null;
      })
      .finally(() => setIsSubmitting(false));
  };

  return { createNewsWithMedia, updateNewsWithMedia, isSubmitting, error };
};
