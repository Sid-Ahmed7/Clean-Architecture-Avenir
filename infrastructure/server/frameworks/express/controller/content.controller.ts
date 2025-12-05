import { Request, Response } from "express";
import { InMemoryContentRepository } from "../../../../adapters/repositories/InMemoryContentRepository";
import {ManageOrderService} from "../../../../adapters/services/news/ManageOrderService";
import {CreateContentUseCase} from  "../../../../../application/usecases/news/content/CreateContentUseCase";
import {GetContentByIdUseCase} from "../../../../../application/usecases/news/content/GetContentByIdUseCase";
import {GetContentsByNewsIdUseCase} from "../../../../../application/usecases/news/content/GetContentsByNewsIdUseCase";
import {UpdateContentUseCase}from "../../../../../application/usecases/news/content/UpdateContentUseCase";
import {DeleteContentUseCase} from "../../../../../application/usecases/news/content/DeleteContentUseCase";
import {ReorderContentsUseCase} from "../../../../../application/usecases/news/content/ReorderContentsUseCase";
import { InvalidContentError } from "../../../../../domain/errors/InvalidContentError";
import { ContentNotFoundError } from "../../../../../application/errors/ContentNotFoundError";
import {CryptoUuidGenerator} from "../../../../adapters/services/CryptoUuidGenerator";

export class ContentController {
    public constructor(private contentRepository: InMemoryContentRepository, 
                       private orderService : ManageOrderService,
                       private uuidService:CryptoUuidGenerator 
                       ){}

    async create(req: Request, res: Response) {
        const createContentUseCase = new CreateContentUseCase(this.contentRepository, this.orderService, this.uuidService);
        const {newsId, content} = req.body;

        const result = await createContentUseCase.execute({ newsId: newsId, content });
        if(result instanceof Error) {
            if(result instanceof InvalidContentError) {
                return res.status(400).json({error: result.message});
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(201).json(result);
    }

    async getById(req: Request, res: Response) {
        const getContentByIdUseCase = new GetContentByIdUseCase(this.contentRepository);
        const id = req.params.id;
        if (!id) {
        return res.status(400).json({ error: "Content ID is required" });
        }

        const result = await getContentByIdUseCase.execute(id);

        if (result instanceof Error) {
            if(result instanceof ContentNotFoundError) {
              return res.status(404).json({ error: result.message });  
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json(result);
    }
     async getByNewsId(req: Request, res: Response) {
        const useCase = new GetContentsByNewsIdUseCase(this.contentRepository);
        const newsId = req.params.newsId;
        if (!newsId) {
            return res.status(400).json({ error: "News ID is required" });
        }
        
        const result = await useCase.execute(newsId);
        return res.json(result);
    }

    async update(req: Request, res: Response) {
        const updateContentUseCase = new UpdateContentUseCase(this.contentRepository);
        const content = req.body;

        const result = await updateContentUseCase.execute(content);
        if (result instanceof Error) {
            if(result instanceof ContentNotFoundError) {
              return res.status(404).json({ error: result.message });  
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json(result);
    }

    async delete(req: Request, res: Response) {
        const deleteContentUseCase = new DeleteContentUseCase(this.contentRepository);
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: "Content ID is required" });
        }

        const result = await deleteContentUseCase.execute(id);
        if (result instanceof Error) {
            if(result instanceof ContentNotFoundError) {
              return res.status(404).json({ error: result.message });  
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(204).send();
    }

    async reorder(req: Request, res: Response) {
        const reorderContentsUseCase = new ReorderContentsUseCase(this.contentRepository);

        const newsId = req.params.newsId;
        const newOrder: string[] = req.body.newOrder;
        if (!newsId) {
        return res.status(400).json({ error: "NewsId ID is required" });
    }

        const result = await reorderContentsUseCase.execute(newsId, newOrder);

        if (result instanceof Error) {
            if(result instanceof ContentNotFoundError) {
              return res.status(404).json({ error: result.message });  
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json(result);
    }
}