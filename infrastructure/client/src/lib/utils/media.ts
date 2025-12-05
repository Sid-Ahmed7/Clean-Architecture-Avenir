import { Media } from "@/types/media";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
export const getMediaUrl = (url: string) => {
  if (!url) {
    return "";}

    return `${baseUrl}${url}`;
};

export const sortMedia = (media: Media[] | undefined) => {
  return media?.sort((a, b) => {
    if (a.order != null && b.order != null) {
      return a.order - b.order;
    }
    return 0
  })
}