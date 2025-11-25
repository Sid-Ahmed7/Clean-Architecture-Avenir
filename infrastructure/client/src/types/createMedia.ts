export interface CreateMedia {
    newsId: number;
    url: string;
    type: string;
    altText: string;
    order?: number;
    caption: string;
    size: number;
    mimeType: string;
}