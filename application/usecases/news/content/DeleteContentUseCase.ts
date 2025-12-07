import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";

export class DeleteContentUseCase {

    public constructor(private readonly contentRepository: ContentRepositoryInterface){}

    public async execute(contentId: string): Promise<void | Error> {
        const content = await this.contentRepository.findById(contentId);
        
        if(content instanceof Error) {
            return content;
        }

        const deletedContent = await this.contentRepository.delete(contentId);

        if(deletedContent instanceof Error) {
            return deletedContent;
        }
    }   
}