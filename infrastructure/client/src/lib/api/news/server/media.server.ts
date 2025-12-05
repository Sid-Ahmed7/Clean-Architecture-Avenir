import { Media } from "@/types/media";
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

export const getMediaByNewsId = async (newsId: string): Promise<Media[]> => {

  try {
    const cookieHeader = await getServerCookies();

    const response = await fetch(`${API_URL}/media/news/${newsId}`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      cache: 'no-store'
    });


    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};