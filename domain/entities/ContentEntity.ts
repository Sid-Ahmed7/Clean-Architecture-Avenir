import { NewsContentValue } from "../values/NewsContentValue";
import { NewsIdValue } from "../values/NewsIdValue";
import { ContentIdValue } from "../values/ContentIdValue";

export class ContentEntity {
    public static from(id: string, newsId: string,order: number, content: string) {

        const validatedId = ContentIdValue.from(id);
        if(validatedId instanceof Error) {
            return validatedId;
        }
        
        const validatedNewsId = NewsIdValue.from(newsId);
        if(validatedNewsId instanceof Error) {
            return validatedNewsId;
        }


        const validatedContent = NewsContentValue.from(content);
        if(validatedContent instanceof Error) {
            return validatedContent;
        }


        return new ContentEntity(validatedId.value,validatedNewsId.value, order, validatedContent.value);
    }
    private constructor(
        public id: string,
        public newsId: string,
        public order: number,
        public content: string,
    ){}

    setOrder(position: number) {
    this.order = position;
}

}