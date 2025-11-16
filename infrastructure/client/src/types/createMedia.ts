export interface CreateMedia {
    newsId: number;
    url: string;
    type: string;
    altText?: string;
    size: number;
    mimeType: string;
}