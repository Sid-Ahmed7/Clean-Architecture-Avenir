import { NewsFilters } from "../../../domain/interfaces/NewsFilters";
import { NewsRepositoryInterface } from "../../ports/repositories/news/NewsRepositoryInterface";

export class IncrementNewsViewsUseCase {
    public constructor(private newsRepository: NewsRepositoryInterface){}

    public async execute(id: number) {
        const news = await this.newsRepository.findById(id);
        
        if(news instanceof Error) {
            return news;
        }

        news.incrementViews();

        const updatedNews = await this.newsRepository.update(news);
        
        if(updatedNews instanceof Error) {
            return updatedNews;
        }
        
        return updatedNews;
        
    }
}