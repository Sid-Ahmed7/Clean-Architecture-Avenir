import { MediaTypeEnum } from "../enums/MediaTypeEnum";
import { MediaUrlValue } from "../values/MediaUrlValue";

export class MediaEntity {
    public static from(id: number, newsId: number, url: string, type: MediaTypeEnum, order: number, altText: string, caption?: string, size?: number,mimeType?: string) {
        
        const validatedUrl = MediaUrlValue.from(url);
        
        if (validatedUrl instanceof Error) {
            return validatedUrl;
        }

        return new MediaEntity(id,newsId,validatedUrl.value,type, order,altText, caption,size,mimeType);
    }

    private constructor(
        public id: number,
        public newsId: number,
        public url: string,
        public type: MediaTypeEnum,
        public order: number,
        public altText: string,
        public caption?: string,
        public size?: number,
        public mimeType?: string
    ) {}
    


}