import { NewsContentValue } from "../values/NewsContentValue";
import { NewsIdValue } from "../values/NewsIdValue";

export class ContentEntity {
    public static from(id: number,newsId: number,order: number, content: string) {

        const validatedId = NewsIdValue.from(id);
        if(validatedId instanceof Error) {
            return validatedId;
        }

        const validatedContent = NewsContentValue.from(content);
        if(validatedContent instanceof Error) {
            return validatedContent;
        }


        return new ContentEntity(validatedId.value,newsId, order, validatedContent.value);
    }
    private constructor(
        public id: number,
        public newsId: number,
        public order: number,
        public content: string,
    ){}

    setOrder(position: number) {
    this.order = position;
}

}