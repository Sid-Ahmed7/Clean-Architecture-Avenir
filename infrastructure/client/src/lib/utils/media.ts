
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
export const getMediaUrl = (url: string) => {
  if (!url) {
    return "";}

    return `${baseUrl}${url}`;
};
