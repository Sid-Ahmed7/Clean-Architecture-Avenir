import { CreateNews } from "./createNews";
import { News } from "./news";

export interface NewsWithMedia {
    createNewsWithMedia: (data: CreateNews, files: File[]) => Promise<News | null>;
    updateNewsWithMedia: (data: News, files: File[]) => Promise<News | null>;
    isSubmitting: boolean;
    error: string | null;
}