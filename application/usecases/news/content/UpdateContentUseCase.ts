import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";

export class UpdateContentUseCase {
    public constructor ( private readonly contentRepository: ContentRepositoryInterface){}

    public async execute(content: ContentEntity): Promise<ContentEntity | Error>{

        const existingContent = await this.contentRepository.findById(content.id);
        
        if(existingContent instanceof Error) {
            return existingContent;
        }

        const updateContent = await this.contentRepository.update(content);
        
        if(updateContent instanceof Error) {
            return updateContent;
        }

        return updateContent;    
    }
    
}