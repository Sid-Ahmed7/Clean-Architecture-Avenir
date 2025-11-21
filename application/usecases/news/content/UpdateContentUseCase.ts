import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";

export class UpdateContentUseCase {
    public constructor ( private contentRepository: ContentRepositoryInterface){}

    public async execute(content: ContentEntity): Promise<ContentEntity | Error>{

        const existingContent = await this.contentRepository.findById(content.id);
        
        if(existingContent instanceof Error) {
            return existingContent;
        }

        const updateContent = await this.contentRepository.update(existingContent);
        
        if(updateContent instanceof Error) {
            return updateContent;
        }

        return updateContent;    
    }
    
}