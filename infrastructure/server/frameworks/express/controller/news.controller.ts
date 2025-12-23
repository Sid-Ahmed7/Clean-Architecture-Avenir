import { Request, Response } from "express";
import { NewsRepositoryInterface } from "../../../../../application/ports/repositories/news/NewsRepositoryInterface";
import { NewsService} from "../../../../adapters/services/news/NewsService";
import { CreateNewsUseCase } from "../../../../../application/usecases/news/CreateNewsUseCase";
import { GetAllNewsUseCase } from "../../../../../application/usecases/news/GetAllNewsUseCase";
import { GetNewsByIdUseCase } from "../../../../../application/usecases/news/GetNewsByIdUseCase";
import {UpdateNewsUseCase} from "../../../../../application/usecases/news/UpdateNewsUseCase";
import {DeleteNewsUseCase} from "../../../../../application/usecases/news/DeleteNewsUseCase";
import { InvalidNewsError } from "../../../../../domain/errors/InvalidNewsError";
import { NewsNotFoundError } from "../../../../../application/errors/NewsNotFoundError";
import { SseClient } from "../../../../../application/ports/services/news/NewsPublisher";
import { NewsFilters } from "../interfaces/NewsFilters";
import {CryptoUuidGenerator} from "../../../../adapters/services/CryptoUuidGenerator";
import { createNewsSchema } from "../schemas/news/createNewsSchema";
export class NewsController {

    public constructor(
        private readonly newsRepository: NewsRepositoryInterface,
        private readonly newPublisher: NewsService,
        private readonly uuidService: CryptoUuidGenerator
    ){}


    async createNews(req: Request, res: Response) {
        const createNewsUseCase = new CreateNewsUseCase(this.newsRepository, this.newPublisher, this.uuidService);
        const parseResult = createNewsSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }

        const result = await createNewsUseCase.execute(parseResult.data);

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
        const newsId = req.params.id;
        if (!newsId) {
            return res.status(400).json({ error: "News ID is required" });
        }
        const result = await getNewsByIdUseCase.execute(newsId);

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
        const newsId = req.params.id;
        if (!newsId) {
            return res.status(400).json({ error: "News ID is required" });
        }
        const result = await deleteNewsUseCase.execute(newsId);

        if(result instanceof Error) {
            if(result instanceof NewsNotFoundError) {
                return res.status(404).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(204).send();
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