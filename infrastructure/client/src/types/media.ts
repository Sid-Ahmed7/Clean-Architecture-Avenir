export interface Media {
    id: number;
    newsId: number;
    url: string;
    type: "IMAGE" | "VIDEO";
    altText: string;
    order: number;
    caption: string;
    size: number;
    mimeType: string;
}