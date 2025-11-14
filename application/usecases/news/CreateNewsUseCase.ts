import { NewsEntity } from "../../../domain/entities/NewsEntity";
import { NewsRepositoryInterface } from "../../ports/repositories/news/NewsRepositoryInterface";
import { NewsPublisher } from "../../ports/services/news/NewsPublisher";
import { MediaRepositoryInterface } from "../../ports/repositories/news/MediaRepositoryInterface";

export class CreateNewsUseCase {
    public constructor( private newsRepository: NewsRepositoryInterface, 
                        private mediaRepository: MediaRepositoryInterface,
                        private publisher: NewsPublisher){}

    public async execute(news: NewsEntity): Promise<NewsEntity | Error> {
        const newNews = NewsEntity.from(0, news.title, news.content, news.category, news.priority, news.tags, news.views, new Date(), []);
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