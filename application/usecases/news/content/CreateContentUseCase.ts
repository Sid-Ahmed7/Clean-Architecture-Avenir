import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";
import { OrderService } from "../../../ports/services/news/OrderService";
import { UuidGeneratorService } from "../../../ports/services/UuidGeneratorService";

export class CreateContentUseCase {

    public constructor(private contentRepository: ContentRepositoryInterface, 
                       private contentService: OrderService,
                       private uuidService: UuidGeneratorService ){}

public async execute(content: { newsId: string; content: string }){

        const id = this.uuidService.generate()

        const order = await this.contentService.getNextOrder(content.newsId);
        const contentEntity = ContentEntity.from(id, content.newsId, order, content.content);

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