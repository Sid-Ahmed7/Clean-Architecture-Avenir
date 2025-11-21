export interface CreateMedia {
    newsId: number;
    url: string;
    type: string;
    altText?: string;
    order?: number;
    size: number;
    mimeType: string;
}