import { MediaTypeEnum } from "../../domain/enums/MediaTypeEnum";

export interface CreateMedia {
    newsId: string;
    url: string;
    type: MediaTypeEnum;
    caption?: string;
    altText?: string; 
    size: number;
    mimeType: string;
}
