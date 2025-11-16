import { NewsCategoryEnum } from "../enums/NewsCategoryEnum";
import { NewsPriorityEnum } from "../enums/NewsPriorityEnum";
import { NewsContentValue } from "../values/NewsContentValue";
import { NewsIdValue } from "../values/NewsIdValue";
import { NewsTagValue } from "../values/NewsTagValue";
import { NewsTitleValue } from "../values/NewsTitleValue";

export class NewsEntity {
    public static from(id: number, title: string, content: string, category: NewsCategoryEnum, priority: NewsPriorityEnum = NewsPriorityEnum.LOW, tags: string[], views: number = 0, createdAt: Date, media: number[], updatedAt?: Date) {

        const validatedId = NewsIdValue.from(id);
        if(validatedId instanceof Error) {
            return validatedId;
        }

        const validatedTitle = NewsTitleValue.from(title);
        if(validatedTitle instanceof Error) {
            return validatedTitle;
        }

        const validatedContent = NewsContentValue.from(content);
        if(validatedContent instanceof Error) {
            return validatedContent;
        }

        const validatedTags: string[] = [];
        for(const tag of tags) {
            const validatedTag = NewsTagValue.from(tag);
            if(validatedTag instanceof Error) {
                return validatedTag;
            }
            validatedTags.push(validatedTag.value);
        }


        return new NewsEntity(validatedId.value, validatedTitle.value, validatedContent.value, category, priority, validatedTags, views, createdAt,updatedAt);
    }
    private constructor(
        public id: number,
        public title: string,
        public content: string,
        public category: NewsCategoryEnum,
        public priority: NewsPriorityEnum,
        public tags: string[],
        public views: number,
        public createdAt: Date,
        public updatedAt?: Date
    ){}

    incrementViews(): void {
        this.views += 1;
    }
}