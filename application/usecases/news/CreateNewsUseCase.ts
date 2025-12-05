import { NewsEntity } from "../../../domain/entities/NewsEntity";
import { NewsRepositoryInterface } from "../../ports/repositories/news/NewsRepositoryInterface";
import { NewsPublisher } from "../../ports/services/news/NewsPublisher";
import { MediaRepositoryInterface } from "../../ports/repositories/news/MediaRepositoryInterface";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";

export class CreateNewsUseCase {
    public constructor( private newsRepository: NewsRepositoryInterface, 
                        private publisher: NewsPublisher,
                        private uuidService: UuidGeneratorService
                    ){}

    public async execute(news: NewsEntity): Promise<NewsEntity | Error> {

        const id = this.uuidService.generate();
        const newNews = NewsEntity.from(id, news.title, news.category, news.priority, news.tags, new Date());
        if(newNews instanceof Error) {
            return newNews;
        }

        const createdNews = await this.newsRepository.create(newNews);

        if(createdNews instanceof Error) {
            return createdNews;
        }

        this.publisher.publish(createdNews);
        
        return createdNews;

    }
}