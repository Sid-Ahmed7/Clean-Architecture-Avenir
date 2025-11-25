import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { MediaTypeEnum } from "../../../../domain/enums/MediaTypeEnum";
import { MediaRepositoryInterface } from "../../../ports/repositories/news/MediaRepositoryInterface";
import { NewsRepositoryInterface } from "../../../ports/repositories/news/NewsRepositoryInterface";
import {OrderService} from "../../../ports/services/news/OrderService";
import {AltTextService} from "../../../ports/services/news/AltTextService";

export class CreateMediaUseCase {
    
    constructor(
        private mediaRepository: MediaRepositoryInterface,
        private newsRepository: NewsRepositoryInterface,
        private mediaService: OrderService,
        private altTextService: AltTextService
    ) {}

    async execute(media: Omit<MediaEntity ,"id" | "order">): Promise<MediaEntity | Error> {
        
        const news = await this.newsRepository.findById(media.newsId);
        if (news instanceof Error) {
            return news;
        }
        const order = await this.mediaService.getNextOrder(news.id);
        const altText =  this.altTextService.generateAltText(media.url);

        const mediaEntity = MediaEntity.from(
            0,
            news.id,
            media.url,
            media.type,
            order,
            altText,
            media.caption ?? "",
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