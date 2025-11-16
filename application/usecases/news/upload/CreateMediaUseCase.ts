import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { MediaTypeEnum } from "../../../../domain/enums/MediaTypeEnum";
import { MediaRepositoryInterface } from "../../../ports/repositories/news/MediaRepositoryInterface";
import { NewsRepositoryInterface } from "../../../ports/repositories/news/NewsRepositoryInterface";

export class CreateMediaUseCase {
    
    constructor(
        private mediaRepository: MediaRepositoryInterface,
        private newsRepository: NewsRepositoryInterface
    ) {}

    async execute(media: Omit<MediaEntity ,"id">): Promise<MediaEntity | Error> {
        
        const news = await this.newsRepository.findById(media.newsId);
        if (news instanceof Error) {
            return news;
        }

        const mediaEntity = MediaEntity.from(
            0,
            news.id,
            media.url,
            media.type,
            media.altText,
            media.size,
            media.mimeType
        );

        if (mediaEntity instanceof Error) {
            return mediaEntity;
        }

        const savedMedia = await this.mediaRepository.create(mediaEntity);
        if (savedMedia instanceof Error) {
            return savedMedia;
        }

        return savedMedia;
    }
}