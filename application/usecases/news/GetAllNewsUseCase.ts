import { NewsFilters } from "../../../domain/interfaces/NewsFilters";
import { NewsRepositoryInterface } from "../../ports/repositories/NewsRepositoryInterface";

export class GetAllNewsUseCase {
    public constructor(private newsRepository: NewsRepositoryInterface){}

    public async execute(filters?: NewsFilters, page = 1, limit = 10) {
        const newsList = await this.newsRepository.findAll(filters, page, limit);
        return newsList;
    }
}