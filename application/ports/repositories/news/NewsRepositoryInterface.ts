import { NewsEntity } from "../../../../domain/entities/NewsEntity";
import { InvalidNewsError } from "../../../../domain/errors/InvalidNewsError";
import { NewsFilters } from "../../../../domain/interfaces/NewsFilters";
import { NewsNotFoundError } from "../../../errors/NewsNotFoundError";

export interface NewsRepositoryInterface {

    create(news: NewsEntity): Promise<NewsEntity | InvalidNewsError>;
    findById(id: number): Promise<NewsEntity | NewsNotFoundError>;
    findAll(filters?: NewsFilters, page?: number, limit?: number): Promise<NewsEntity[]>;
    update(news: NewsEntity): Promise<NewsEntity | NewsNotFoundError | InvalidNewsError>;
    delete(id: number): Promise<void | NewsNotFoundError>;
}