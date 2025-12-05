import { Content } from "@/types/content";
import { apiClient } from "../../apiClient";
import { CreateContent } from "@/types/createContent";
import { UpdateContent } from "@/types/updateContent";

export const getContentsByNewsId = async (newsId: string): Promise<Content[]> => {
    const {data} = await apiClient.get(`/content/news/${newsId}`);
    return Array.isArray(data) ? data : []; 
}

export const getContentsId = async (contentId: string): Promise<Content> => {
    const {data} = await apiClient.get(`/content/${contentId}`);
    return data; 
}

export const createContent = async (content: CreateContent): Promise<Content[]> => {
    const {data} = await apiClient.post(`/content/create`, content);
    return data;  
}

export const updateContent = async (content: UpdateContent): Promise<Content> => {
    const {data} = await apiClient.put(`/content/update`, content);
    return data;  
}
export const deleteContent = async (contentId: string): Promise<void> => {
     const {data} = await apiClient.delete(`/content/${contentId}`);
    return data;  
}
export const reorderContents = async (newsId: string, newOrder: string[]): Promise<Content[]> => {
    const { data } = await apiClient.post(`/content/reorder/${newsId}`, { newOrder });
    return data;
};


