import { NewsEntity } from "../../../domain/entities/NewsEntity";
import { NewsFilters } from "../../../domain/interfaces/NewsFilters";
import { NewsRepositoryInterface } from "../../ports/repositories/news/NewsRepositoryInterface";

export class GetNewsByIdUseCase {
    public constructor(private newsRepository: NewsRepositoryInterface){}

    public async execute(newsId: string): Promise<NewsEntity | Error> {
        const news = await this.newsRepository.findById(newsId);
        if(news instanceof Error) {
            return news;
        }
        return news;
    }
}