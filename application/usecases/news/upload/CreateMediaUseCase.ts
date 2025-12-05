import { MediaEntity } from "../../../../domain/entities/MediaEntity";
import { MediaTypeEnum } from "../../../../domain/enums/MediaTypeEnum";
import { MediaRepositoryInterface } from "../../../ports/repositories/news/MediaRepositoryInterface";
import { NewsRepositoryInterface } from "../../../ports/repositories/news/NewsRepositoryInterface";
import {OrderService} from "../../../ports/services/news/OrderService";
import {AltTextService} from "../../../ports/services/news/AltTextService";
import { UuidGeneratorService } from "../../../ports/services/UuidGeneratorService";

export class CreateMediaUseCase {
    
    constructor(
        private mediaRepository: MediaRepositoryInterface,
        private newsRepository: NewsRepositoryInterface,
        private mediaService: OrderService,
        private altTextService: AltTextService,
        private uuidService: UuidGeneratorService
    ) {}

    async execute(media: Omit<MediaEntity ,"id" | "order">): Promise<MediaEntity | Error> {

        const news = await this.newsRepository.findById(media.newsId);
        if (news instanceof Error) {
            return news;
        }

        const order = await this.mediaService.getNextOrder(news.id);
        const altText =  this.altTextService.generateAltText(media.url);
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
            console.error("❌ [CreateMediaUseCase] execute - MediaEntity creation error:", mediaEntity.message);
            return mediaEntity;
        }

        console.log("🔍 [CreateMediaUseCase] execute - MediaEntity created:", mediaEntity);

        const savedMedia = await this.mediaRepository.create(mediaEntity);
        if (savedMedia instanceof Error) {
            console.error("❌ [CreateMediaUseCase] execute - Save error:", savedMedia.message);
            return savedMedia;
        }

        console.log("✅ [CreateMediaUseCase] execute - Media saved:", savedMedia);
        return savedMedia;
    }
}