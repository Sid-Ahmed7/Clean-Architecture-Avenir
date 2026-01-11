import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { MediaTypeEnum } from "../../../../domain/enums/MediaTypeEnum";
import { MediaRepositoryInterface } from "../../../ports/repositories/news/MediaRepositoryInterface";
import { NewsRepositoryInterface } from "../../../ports/repositories/news/NewsRepositoryInterface";
import {OrderService} from "../../../ports/services/news/OrderService";
import {AltTextService} from "../../../ports/services/news/AltTextService";
import { UuidGeneratorService } from "../../../ports/services/UuidGeneratorService";
import { CreateMedia } from "../../../requests/CreateMedia";

export class CreateMediaUseCase {
    
    constructor(
        private readonly mediaRepository: MediaRepositoryInterface,
        private readonly newsRepository: NewsRepositoryInterface,
        private readonly mediaService: OrderService,
        private readonly altTextService: AltTextService,
        private readonly uuidService: UuidGeneratorService
    ) {}

    async execute(media: CreateMedia): Promise<MediaEntity | Error> {

        const news = await this.newsRepository.findById(media.newsId);
        if (news instanceof Error) {
            return news;
        }

        const order = await this.mediaService.getNextOrder(news.id);
        const altText = this.altTextService.generateAltText(media.url);
        const id = this.uuidService.generate();

        const mediaEntity = MediaEntity.from(
            id,
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