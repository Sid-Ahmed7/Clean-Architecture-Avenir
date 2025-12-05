import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";

export class GetContentByIdUseCase {

    public constructor(private contentRepository: ContentRepositoryInterface){}

    public async execute(contentId : string): Promise<ContentEntity | Error> {
        
        const content = await this.contentRepository.findById(contentId);

        if (content instanceof Error) {
            return content;
        }

        return content;
    }   
}