export interface Media {
    id: number;
    newsId: number;
    url: string;
    type: "IMAGE" | "VIDEO";
    altIndex?: string;
    order?: number;
    size: number;
    mimeType: string;
}