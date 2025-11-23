import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";
import { OrderService } from "../../../ports/services/news/OrderService";

export class CreateContentUseCase {

    public constructor(private contentRepository: ContentRepositoryInterface, private contentService: OrderService){}

public async execute(content: { newsId: number; content: string }){

        const order = await this.contentService.getNextOrder(content.newsId);
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