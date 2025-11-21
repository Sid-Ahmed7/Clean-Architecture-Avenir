import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";

export class CreateContentUseCase {

    public constructor(private contentRepository: ContentRepositoryInterface){}

public async execute(content: { newsId: number; content: string }){
        const order = this.contentRepository.getNextOrder(content.newsId);

        const contentEntity = ContentEntity.from(0, content.newsId, order, content.content);

        if(contentEntity instanceof Error) {
            return contentEntity;
        }

        const createContent = await this.contentRepository.create(contentEntity);
        
        if(createContent instanceof Error) {
            return createContent;
        }

        return createContent;    
    }   
}