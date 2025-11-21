
import { Media } from "@/types/media";
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

export const getMediaByNewsId = async (newsId: number): Promise<Media[]> => {
 

  try {
    const cookieHeader = await getServerCookies();

    const response = await axios.get(`${API_URL}/media/news/${newsId}`, {
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

export const getMediaById = async (id: number): Promise<Media | null> => {
  try {
    const cookieHeader = await getServerCookies();

    const response = await axios.get(`${API_URL}/content/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });

    return response.data ?? null;
  } catch (err) {
    console.error("Error fetching news by id:", err);
    return null;
  }
};