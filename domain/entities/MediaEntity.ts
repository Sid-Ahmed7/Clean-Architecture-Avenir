import { MediaTypeEnum } from "../enums/MediaTypeEnum";
import { MediaUrlValue } from "../values/MediaUrlValue";
import { NewsIdValue } from "../values/NewsIdValue";

export class MediaEntity {
    public static from(id: string, newsId: string, url: string, type: MediaTypeEnum, order: number, altText: string, caption?: string, size?: number,mimeType?: string) {

        const validatedUrl = MediaUrlValue.from(url);

        if (validatedUrl instanceof Error) {
            return validatedUrl;
        }

        const validatedNewsId = NewsIdValue.from(newsId);
            if(validatedNewsId instanceof Error) {
                return validatedNewsId;
            }

        return new MediaEntity(id,validatedNewsId.value,validatedUrl.value,type, order,altText, caption,size,mimeType);
    }

    private constructor(
        public id: string,
        public newsId: string,
        public url: string,
        public type: MediaTypeEnum,
        public order: number,
        public altText: string,
        public caption?: string,
        public size?: number,
        public mimeType?: string
    ) {}
    


}