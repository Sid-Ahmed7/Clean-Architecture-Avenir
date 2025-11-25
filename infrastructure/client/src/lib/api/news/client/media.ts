import { Media } from "@/types/media";
import { apiClient } from "../../apiClient";

export const uploadMedia = async(file: File, newsId: number) => {
    const formData = new FormData();
    formData.append("media", file);
    formData.append("newsId", newsId.toString());

    const {data} = await apiClient.post("/media/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    return data;
}

export const getMediaByNewsId = async (newsId: number): Promise<Media[]> => {
    const {data} = await apiClient.get(`/media/news/${newsId}`);
    return Array.isArray(data) ? data : [];
}

export const updateMedia = async (media: Media): Promise<Media> => {
    const {data} = await apiClient.put(`/media/update`, media);
    return data;  
}

export const deleteMedia = async (mediaId: number): Promise<void> => {
    await apiClient.delete(`/media/${mediaId}`);
    
}