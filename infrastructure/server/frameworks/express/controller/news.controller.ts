import { Request, Response } from "express";

import { InMemoryNewsRepository } from "../../../../adapters/repositories/InMemoryNewsRepository";
import { InMemoryMediaRepository } from "../../../../adapters/repositories/InMemoryMediaRepository";

import { NewsService} from "../../../../adapters/services/news/NewsService";
import { LocalFileStorageService} from "../../../../adapters/services/news/LocalFileStorageService";
import { CreateNewsUseCase } from "../../../../../application/usecases/news/CreateNewsUseCase";
import { GetAllNewsUseCase } from "../../../../../application/usecases/news/GetAllNewsUseCase";
import { GetNewsByIdUseCase } from "../../../../../application/usecases/news/GetNewsByIdUseCase";
import {UpdateNewsUseCase} from "../../../../../application/usecases/news/UpdateNewsUseCase";
import {DeleteNewsUseCase} from "../../../../../application/usecases/news/DeleteNewsUseCase";
import {IncrementNewsViewsUseCase} from "../../../../../application/usecases/news/IncrementNewsViewsUseCase";
import { InvalidNewsError } from "../../../../../domain/errors/InvalidNewsError";
import { NewsNotFoundError } from "../../../../../application/errors/NewsNotFoundError";
import { SseClient } from "../../../../../application/ports/services/news/NewsPublisher";
import { NewsFilters } from "../interfaces/NewsFilters";

export class NewsController {



    public constructor(
        private newsRepository: InMemoryNewsRepository, 
        private newPublisher: NewsService,
    ){}


    async createNews(req: Request, res: Response) {
        const createNewsUseCase = new CreateNewsUseCase(this.newsRepository, this.newPublisher);
        const result = await createNewsUseCase.execute(req.body);

        if(result instanceof Error) {
            if(result instanceof InvalidNewsError) {
                return res.status(400).json({error: result.message});
            }

            return res.status(500).json({error: result.message});
        }
        return res.status(201).json(result);
    }

    async getAllNews(req: Request, res: Response) {
        const getAllNewsUseCase = new GetAllNewsUseCase(this.newsRepository);
        const filters: NewsFilters= {};
        if(req.query.category) {
            filters.category = req.query.category as string;
        }
        if(req.query.tags) {
            filters.tags = (req.query.tags as string).split(",");
        }
        if(req.query.priority) {
            filters.priority = req.query.priority as string;
        }

        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        
        const result = await getAllNewsUseCase.execute(filters, page, limit);
        if(result instanceof Error) {
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json(result);
    }

    async getNewsById(req: Request, res: Response) {
        const getNewsByIdUseCase = new GetNewsByIdUseCase(this.newsRepository);
        const id = Number(req.params.id);
        const result = await getNewsByIdUseCase.execute(id);

        if(result instanceof Error) {
            if(result instanceof NewsNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }

    async updateNews(req: Request, res: Response) {
        const updateNewsUseCase = new UpdateNewsUseCase(this.newsRepository, this.newPublisher);
        const result = await updateNewsUseCase.execute(req.body);
        if(result instanceof Error) {
            if(result instanceof NewsNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            if(result instanceof InvalidNewsError) {
                return res.status(400).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }

        return res.status(200).json(result);
    }

    async deleteNews(req: Request, res: Response) {
        const deleteNewsUseCase = new DeleteNewsUseCase(this.newsRepository, this.newPublisher);
        const id = Number(req.params.id);
        const result = await deleteNewsUseCase.execute(id);

        if(result instanceof Error) {
            if(result instanceof NewsNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(204).send();
    }

    async incrementNewsViews(req: Request, res: Response) {
        const incrementNewsViewsUseCase = new IncrementNewsViewsUseCase(this.newsRepository);
        const id = Number(req.params.id);
        const result = await incrementNewsViewsUseCase.execute(id);

        if(result instanceof Error) {
            if(result instanceof NewsNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json(result);
    }

    public subscribe(req: Request, res: Response) {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": `${process.env.CLIENT_BASE_URL}`,
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "text/event-stream",
            "Connection": "keep-alive",
            "Cache-Control": "no-cache"
        });

        const client: SseClient = {
            write: (data: string) => res.write(data),
            close: () => res.end(),
        };

        this.newPublisher.subscribe(client);

        req.on("close", () => {
            this.newPublisher.unsubscribe(client);
        });
    }


    
}