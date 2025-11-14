import { MediaTypeEnum } from "../enums/MediaTypeEnum";
import { MediaUrlValue } from "../values/MediaUrlValue";

export class MediaEntity {
    public static from(id: number, newsId: number, url: string, type: MediaTypeEnum,orderIndex: number = 0,altText?: string,size?: number,mimeType?: string) {
        
        const validatedUrl = MediaUrlValue.from(url);
        
        if (validatedUrl instanceof Error) {
            return validatedUrl;
        }

        return new MediaEntity(id,newsId,validatedUrl.value,type,orderIndex,altText,size,mimeType);
    }

    private constructor(
        public id: number,
        public newsId: number,
        public url: string,
        public type: MediaTypeEnum,
        public orderIndex: number,
        public altText?: string,
        public size?: number,
        public mimeType?: string
    ) {}

    isImage(): boolean {
        return this.type === MediaTypeEnum.IMAGE;
    }

    isVideo(): boolean {
        return this.type === MediaTypeEnum.VIDEO;
    }
}