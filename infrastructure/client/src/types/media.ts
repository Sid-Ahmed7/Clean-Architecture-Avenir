export interface Media {
    id: number;
    newsId: number;
    url: string;
    type: "IMAGE" | "VIDEO";
    altIndex?: string;
    size: number;
    mimeType: string;
}