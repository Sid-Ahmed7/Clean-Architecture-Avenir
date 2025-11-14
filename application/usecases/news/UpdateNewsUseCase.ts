import { NewsEntity } from "../../../domain/entities/NewsEntity";
import { NewsRepositoryInterface } from "../../ports/repositories/news/NewsRepositoryInterface";
import { NewsPublisher } from "../../ports/services/news/NewsPublisher";


export class UpdateNewsUseCase {
    public constructor ( private newsRepository: NewsRepositoryInterface, private publisher: NewsPublisher){}

    public async execute(news: NewsEntity): Promise<NewsEntity | Error>{

        const existingNews = await this.newsRepository.findById(news.id);
        
        if(existingNews instanceof Error) {
            return existingNews;
        }

        const updateNews = await this.newsRepository.update(existingNews);
        
        if(updateNews instanceof Error) {
            return updateNews;
        }

        this.publisher.publishUpdate(updateNews);

        return updateNews;    
    }
    
}