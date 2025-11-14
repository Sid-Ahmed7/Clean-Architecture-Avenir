import { NewsNotFoundError } from "../../../application/errors/NewsNotFoundError";
import { NewsRepositoryInterface } from "../../../application/ports/repositories/news/NewsRepositoryInterface";
import { NewsEntity } from "../../../domain/entities/NewsEntity";
import { NewsFilters } from "../../../domain/interfaces/NewsFilters";

export class InMemoryNewsRepository implements NewsRepositoryInterface {

    private newsList: Array<NewsEntity>;
    private incrId: number;

    public constructor() {
        this.newsList = [];
        this.incrId = 0;
    }

    public async findById(id: number): Promise<NewsEntity | NewsNotFoundError> {
        const news = this.newsList.find((n) => n.id === id);
        if(!news) {
            return new NewsNotFoundError(`News with ${id} not found`);
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
        this.incrId++;
        news.id = this.incrId;

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

    public async delete(id: number): Promise<void | NewsNotFoundError> {
        const index = this.newsList.findIndex((n) => n.id === id);
        if(index === -1) {
            return new NewsNotFoundError(`News with id ${id} not found`);
        }
        this.newsList.splice(index, 1);
    }

}