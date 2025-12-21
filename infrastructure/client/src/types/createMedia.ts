export interface CreateMedia {
    newsId: string;
    url: string;
    type: string;
    altText: string;
    order?: number;
    caption: string;
    size: number;
    mimeType: string;
}