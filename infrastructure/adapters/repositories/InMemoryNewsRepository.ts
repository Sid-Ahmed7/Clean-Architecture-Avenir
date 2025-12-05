import { NewsNotFoundError } from "../../../application/errors/NewsNotFoundError";
import { NewsRepositoryInterface } from "../../../application/ports/repositories/news/NewsRepositoryInterface";
import { NewsEntity } from "../../../domain/entities/NewsEntity";
import { NewsFilters } from "../../../domain/interfaces/NewsFilters";

export class InMemoryNewsRepository implements NewsRepositoryInterface {

    private newsList: Array<NewsEntity>;

    public constructor() {
        this.newsList = [];
    }

    public async findById(newsId: string): Promise<NewsEntity | NewsNotFoundError> {
        const news = this.newsList.find((n) => n.id === newsId);
        if(!news) {
            return new NewsNotFoundError(`News with ${newsId} not found`);
        }
        return news;
    }

    public async findAll(filters?: NewsFilters, page = 1, limit = 10): Promise<NewsEntity[]> {
        let filteredNews = [...this.newsList];

        if(filters?.category) {
            filteredNews = filteredNews.filter(n => n.category === filters.category);
        }

        if(filters?.tags && filters.tags.length > 0) {
            filteredNews = filteredNews.filter(n => 
                filters.tags?.some(tag => 
                    n.tags.some(newsTag => newsTag === tag)
                )
            )
        }

        if(filters?.priority) {
            filteredNews = filteredNews.filter(n => n.priority === filters.priority);
        }

        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedNews = filteredNews.slice(start, end);
        return paginatedNews;
    }

    public async create(news: NewsEntity): Promise<NewsEntity> {
        this.newsList.push(news);
        return news;
    }

    public async update(news: NewsEntity): Promise<NewsEntity | NewsNotFoundError> {
        const index = this.newsList.findIndex((n) => n.id === news.id);
        if(index === -1) {
            return new NewsNotFoundError(`News with id ${news.id} not found`);
        }
        this.newsList[index] = news;
        return news
    }

    public async delete(newsId: string): Promise<void | NewsNotFoundError> {
        const index = this.newsList.findIndex((n) => n.id === newsId);
        if(index === -1) {
            return new NewsNotFoundError(`News with id ${newsId} not found`);
        }
        this.newsList.splice(index, 1);
    }

}