import { NewsFilters } from "@/types/filtersNews";
import { News } from "@/types/news";
import { apiClient } from "../../apiClient";

export const getAllNews = async (filters: NewsFilters): Promise<Array<News>> => {
    const queryParams = new URLSearchParams();
    
    if (filters.category) {
        queryParams.append("category", filters.category);
    }

    if(filters.tags && filters.tags.length > 0) {
        queryParams.append("tags", filters.tags.join(","));
    }

    if(filters.priority) {
        queryParams.append("priority", filters.priority);
    }

    if(filters.page) {
        queryParams.append("page", filters.page.toString());
    }
    if(filters.limit) {
        queryParams.append("limit", filters.limit.toString());
    }

    const response = await apiClient.get(`/feed?${queryParams.toString()}`);
    return Array.isArray(response.data) ? response.data : [];
};

export const createNews = async (news: Partial<News>) : Promise<News> => {
    const {data} = await apiClient.post('/feed/create', news);
    return data;
};

export const updateNews = async (news: News) : Promise<News> => {
    const {data} = await apiClient.put('/feed/update', news);
    return data;
};

export const deleteNews = async (id: number) : Promise<void> => {
    await apiClient.delete(`/feed/delete/${id}`);
}

export const incrementNewsViews = async (id: number) : Promise<News> => {
    const {data} = await apiClient.put(`/feed/increment-views/${id}`);
    return data;
}