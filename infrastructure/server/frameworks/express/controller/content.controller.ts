import { Request, Response } from "express";
import { ContentRepositoryInterface } from "../../../../../application/ports/repositories/news/ContentRepositoryInterface";
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
import { createContentSchema } from "../schemas/content/createContentSchema";
import { reorderContentSchema } from "../schemas/content/reorderContentSchema";

export class ContentController {
    public constructor(private readonly contentRepository: ContentRepositoryInterface,
                       private readonly orderService : ManageOrderService,
                       private readonly uuidService:CryptoUuidGenerator
                       ){}

    async create(req: Request, res: Response) {
        const createContentUseCase = new CreateContentUseCase(this.contentRepository, this.orderService, this.uuidService);
        const parseResult = createContentSchema.safeParse(req.body);
        if (!parseResult.success) {
          return res.status(400).json({ errors: parseResult.error.message });
        }
        const {newsId, content} = parseResult.data;

        const result = await createContentUseCase.execute({ newsId: newsId, content  });
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

        const result = await getContentByIdUseCase.execute(id as string);

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
        
        const result = await useCase.execute(newsId as string);
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

        const result = await deleteContentUseCase.execute(id as string);
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
        const parseResult = reorderContentSchema.safeParse(req.body);
        if (!parseResult.success) {
          return res.status(400).json({ errors: parseResult.error.message });
        }
        if (!newsId) {
        return res.status(400).json({ error: "NewsId ID is required" });
    }

        const result = await reorderContentsUseCase.execute(newsId as string, parseResult.data.newOrder);

        if (result instanceof Error) {
            if(result instanceof ContentNotFoundError) {
              return res.status(404).json({ error: result.message });  
            }
            return res.status(500).json({error: result.message});
        }
        return res.status(200).json(result);
    }
}