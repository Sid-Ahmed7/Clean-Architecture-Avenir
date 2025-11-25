import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { MediaRepositoryInterface } from "../../../ports/repositories/news/MediaRepositoryInterface";

export class GetMediaByNewsIdUseCase {
    public constructor(private mediaRepository: MediaRepositoryInterface) {}

    public async execute(newsId: number) {
        return await this.mediaRepository.findByNewsId(newsId);
    }
}