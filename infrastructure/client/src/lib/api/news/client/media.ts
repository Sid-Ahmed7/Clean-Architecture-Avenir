import { Media } from "@/types/media";
import { apiClient } from "../../apiClient";

export const uploadMedia = async(file: File, newsId: string) => {
    const formData = new FormData();
    formData.append("media", file);
    formData.append("newsId", newsId);

    const {data} = await apiClient.post("/media/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return data;
}

export const getMediaByNewsId = async (newsId: string): Promise<Media[]> => {
    const {data} = await apiClient.get(`/media/news/${newsId}`);
    return Array.isArray(data) ? data : [];
}

export const updateMedia = async (media: Media): Promise<Media> => {
    const {data} = await apiClient.put(`/media/update`, media);
    return data;  
}

export const deleteMedia = async (mediaId: string): Promise<void> => {
    await apiClient.delete(`/media/${mediaId}`);
    
}