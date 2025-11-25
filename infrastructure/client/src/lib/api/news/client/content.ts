import { Content } from "@/types/content";
import { apiClient } from "../../apiClient";
import { CreateContent } from "@/types/createContent";
import { UpdateContent } from "@/types/updateContent";

export const getContentsByNewsId = async (newsId: number): Promise<Content[]> => {
    const {data} = await apiClient.get(`/content/news/${newsId}`);
    return Array.isArray(data) ? data : []; 
}

export const getContentsId = async (id: number): Promise<Content> => {
    const {data} = await apiClient.get(`/content/${id}`);
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
export const deleteContent = async (id: number): Promise<void> => {
     const {data} = await apiClient.delete(`/content/${id}`);
    return data;  
}
export const reorderContents = async (newsId: number, newOrder: number[]): Promise<Content[]> => {
    const { data } = await apiClient.post(`/content/reorder/${newsId}`, { newOrder });
    return data;
};


