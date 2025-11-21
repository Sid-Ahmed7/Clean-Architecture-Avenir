import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";

export class GetContentByIdUseCase {

    public constructor(private contentRepository: ContentRepositoryInterface){}

    public async execute(id : number): Promise<ContentEntity | Error> {
        
        const content = await this.contentRepository.findById(id);

        if (content instanceof Error) {
            return content;
        }

        return content;
    }   
}