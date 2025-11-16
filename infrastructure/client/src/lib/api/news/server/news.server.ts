import { NewsFilters } from "@/types/filtersNews";
import { News } from "@/types/news";
import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getServerCookies = async () => {
  const cookieStore = await cookies();
  const cookieHeader: string[] = [];

  cookieStore.getAll().forEach((cookie) => {
    cookieHeader.push(`${cookie.name}=${cookie.value}`);
  });

  return cookieHeader.join("; ");
};

export const getAllNews = async (filters: NewsFilters): Promise<Array<News>> => {
  const queryParams = new URLSearchParams();

  if (filters.category) {
    queryParams.append("category", filters.category);
  }

  if (filters.tags && filters.tags.length > 0) {
    queryParams.append("tags", filters.tags.join(","));
  }

  if (filters.priority) {
    queryParams.append("priority", filters.priority);
  }

  if (filters.page) {
    queryParams.append("page", filters.page.toString());
  }

  if (filters.limit) {
    queryParams.append("limit", filters.limit.toString());
  }

  try {
    const cookieHeader = await getServerCookies();

    const response = await axios.get(`${API_URL}/feed?${queryParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader, 
      },
    });

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};