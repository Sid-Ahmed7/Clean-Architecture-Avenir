import { Request, Response } from "express";

import { InMemoryMediaRepository } from "../../../../adapters/repositories/InMemoryMediaRepository";
import { InMemoryNewsRepository } from "../../../../adapters/repositories/InMemoryNewsRepository";
import {ManageOrderService} from "../../../../adapters/services/news/ManageOrderService";
import {GenerateAltTextService} from "../../../../adapters/services/news/GenerateAltTextService";
import { LocalFileStorageService } from "../../../../adapters/services/news/LocalFileStorageService";
import { UploadMediaUseCase } from "../../../../../application/usecases/news/upload/UploadMediaUseCase";
import { UpdateMediaUseCase } from "../../../../../application/usecases/news/upload/UpdateMediaUseCase";
import { CreateMediaUseCase } from "../../../../../application/usecases/news/upload/CreateMediaUseCase";
import { GetMediaByNewsIdUseCase } from "../../../../../application/usecases/news/upload/GetMediaByNewsIdUseCase";
import { DeleteMediaUseCase } from "../../../../../application/usecases/news/upload/DeleteMediaUseCase";
import { MediaTypeEnum } from "../../../../../domain/enums/MediaTypeEnum";
import { MediaEntity } from "../../../../../domain/entities/MediaEntity";
import { MediaNotFoundError } from "../../../../../application/errors/MediaNotFoundError";
import {CryptoUuidGenerator} from "../../../../adapters/services/CryptoUuidGenerator";
import { createMediaSchema } from "../schemas/media/createMediaSchema";
import { CreateMedia } from "../../../../../application/requests/CreateMedia";


export class MediaController {
    
    public constructor(
        private readonly mediaRepository: InMemoryMediaRepository,
        private readonly newsRepository: InMemoryNewsRepository,
        private readonly fileStorageService: LocalFileStorageService,
        private readonly orderService: ManageOrderService,
        private readonly altService: GenerateAltTextService,
        private readonly uuidService:CryptoUuidGenerator 
    ){}

    async uploadMedia(req: Request, res: Response) {
        if (!req.file){
            return res.status(400).json({ error: "No file provided" });
        }

        const uploadMediaUseCase = new UploadMediaUseCase(this.fileStorageService);
        const uploadFile = await uploadMediaUseCase.execute(req.file.buffer, req.file.originalname, req.file.mimetype);
        if (uploadFile instanceof Error) {
            return res.status(500).json({error: uploadFile.message})
        }

        const mediaType = req.file.mimetype.startsWith("image/") ? MediaTypeEnum.IMAGE : MediaTypeEnum.VIDEO;
        const mediaEntity = {
            newsId: req.body.newsId,
            url: uploadFile.url,
            type: mediaType,
            altText: req.body.altText || "",
            size: uploadFile.size,
            mimeType: uploadFile.mimeType,
            caption: req.body.caption ?? "", 
        };
        
        const parseResult = createMediaSchema.safeParse(mediaEntity);
        if (!parseResult.success) {
            return res.status(400).json({ errors: parseResult.error.message });
        }
            const validatedMedia = parseResult.data;


        const createMediaUseCase = new CreateMediaUseCase(this.mediaRepository, this.newsRepository, this.orderService, this.altService, this.uuidService);
        const createdMedia = await createMediaUseCase.execute(validatedMedia)
            if (createdMedia instanceof Error) {
            return res.status(500).json({ error: createdMedia.message });
        }

        return res.status(201).json(createdMedia);
    }

    async getMediaByNewsId(req: Request, res: Response) {
        const newsId = req.params.newsId;
        if (!newsId) {
            return res.status(400).json({ error: "News ID is required" });
        }

        const getMediaUseCase = new GetMediaByNewsIdUseCase(this.mediaRepository);
        const mediaList = await getMediaUseCase.execute(newsId);
        return res.status(200).json(mediaList);
    }
        async updateMedia(req: Request, res: Response) {
            const updateMediaUseCase = new UpdateMediaUseCase(this.mediaRepository);
            const result = await updateMediaUseCase.execute(req.body);
            if(result instanceof Error) {
                if(result instanceof MediaNotFoundError) {
                    return res.status(404).json({error: result.message});
                }
                return res.status(500).json({error: result.message});
            }
    
            return res.status(200).json(result);
        }
    
     async deleteMedia(req: Request, res: Response) {
        const mediaId = req.params.mediaId;
        if (!mediaId) {
            return res.status(400).json({ error: "Invalid mediaId" });
        }

        const deleteMediaUseCase = new DeleteMediaUseCase(this.mediaRepository, this.newsRepository, this.fileStorageService);
        const result = await deleteMediaUseCase.execute(mediaId);

        if (result instanceof Error) {
            return res.status(500).json({ error: result.message });
        }

        return res.status(204).send();
    }


}