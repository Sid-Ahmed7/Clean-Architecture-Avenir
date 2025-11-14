import { MediaRepositoryInterface } from "../../../ports/repositories/news/MediaRepositoryInterface";
import { NewsRepositoryInterface } from "../../../ports/repositories/news/NewsRepositoryInterface";
import { FileStorageService } from "../../../ports/services/news/FileStorageService";

export class DeleteMediaUseCase {
    public constructor(
        private mediaRepository: MediaRepositoryInterface,
        private newsRepository: NewsRepositoryInterface,
        private fileStorageService: FileStorageService
    ) {}

    public async execute(mediaId: number): Promise<void | Error> {

        const media = await this.mediaRepository.findById(mediaId);
        if (media instanceof Error) {
            return media;
        }

        const news = await this.newsRepository.findById(media.newsId);
        if (news instanceof Error) {
            return news;
        }

        const deleteResult = await this.mediaRepository.delete(mediaId);
        if (deleteResult instanceof Error) {
            return deleteResult;
        }

        news.media = news.media.filter(id => id !== mediaId);

        const updatedNewsMedia = await this.newsRepository.update(news);

        if(updatedNewsMedia instanceof Error) {
            return updatedNewsMedia;
        }

 
    }
}