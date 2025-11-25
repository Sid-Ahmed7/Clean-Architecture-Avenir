import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";

export class DeleteContentUseCase {

    public constructor(private contentRepository: ContentRepositoryInterface){}

    public async execute(id: number): Promise<void | Error> {
        const content = await this.contentRepository.findById(id);
        
        if(content instanceof Error) {
            return content;
        }

        const deletedContent = await this.contentRepository.delete(id);

        if(deletedContent instanceof Error) {
            return deletedContent;
        }
    }   
}