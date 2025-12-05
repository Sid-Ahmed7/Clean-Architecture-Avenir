import { ContentEntity } from "../../../../domain/entities/ContentEntity";
import { ContentRepositoryInterface } from "../../../ports/repositories/news/ContentRepositoryInterface";

export class GetContentsByNewsIdUseCase {

    public constructor(private contentRepository: ContentRepositoryInterface){}

    public async execute(newsId : string) {
        return await this.contentRepository.findByNewsId(newsId);
    }   
}