export interface Media {
    id: string;
    newsId: string;
    url: string;
    type: "IMAGE" | "VIDEO";
    altText: string;
    order: number;
    caption: string;
    size: number;
    mimeType: string;
}