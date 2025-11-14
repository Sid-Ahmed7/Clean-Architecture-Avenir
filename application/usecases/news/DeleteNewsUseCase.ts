import { NewsRepositoryInterface } from "../../ports/repositories/news/NewsRepositoryInterface";
import { NewsPublisher } from "../../ports/services/news/NewsPublisher";

export class DeleteNewsUseCase {
    public constructor(private newsRepository: NewsRepositoryInterface, private publisher: NewsPublisher ){}

    public async execute(id: number): Promise<void | Error> {
        const news = await this.newsRepository.findById(id);
        
        if(news instanceof Error) {
            return news;
        }
        const deletedNews = await this.newsRepository.delete(news.id);
        
        if(deletedNews instanceof Error) {
            return deletedNews;
        }

        this.publisher.publishDelete(id);
    }
}