import { Request, Response } from "express";

import { InMemoryMediaRepository } from "../../../../adapters/repositories/InMemoryMediaRepository";
import { InMemoryNewsRepository } from "../../../../adapters/repositories/InMemoryNewsRepository";
import {ManageOrderService} from "../../../../adapters/services/news/ManageOrderService";
import { LocalFileStorageService } from "../../../../adapters/services/news/LocalFileStorageService";
import { UploadMediaUseCase } from "../../../../../application/usecases/news/upload/UploadMediaUseCase";
import { CreateMediaUseCase } from "../../../../../application/usecases/news/upload/CreateMediaUseCase";
import { GetMediaByNewsIdUseCase } from "../../../../../application/usecases/news/upload/GetMediaByNewsIdUseCase";
import { DeleteMediaUseCase } from "../../../../../application/usecases/news/upload/DeleteMediaUseCase";
import { MediaTypeEnum } from "../../../../../domain/enums/MediaTypeEnum";
import { MediaEntity } from "../../../../../domain/entities/MediaEntity";

export class MediaController {
    
    public constructor(
        private mediaRepository: InMemoryMediaRepository,
        private newsRepository: InMemoryNewsRepository,
        private fileStorageService: LocalFileStorageService,
        private orderService: ManageOrderService
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
        const newsId = Number(req.body.newsId);
        const mediaType = req.file.mimetype.startsWith("image/") ? MediaTypeEnum.IMAGE : MediaTypeEnum.VIDEO;
        const mediaEntity = {
            newsId,
            url: uploadFile.url,
            type: mediaType,
            altText: req.body.altText || "",
            size: uploadFile.size,
            mimeType: uploadFile.mimeType,
        };

        const createMediaUseCase = new CreateMediaUseCase(this.mediaRepository, this.newsRepository, this.orderService);
        const createdMedia = await createMediaUseCase.execute(mediaEntity)
            if (createdMedia instanceof Error) {
            return res.status(500).json({ error: createdMedia.message });
        }

        return res.status(201).json(createdMedia);
    }

    async getMediaByNewsId(req: Request, res: Response) {
        const newsId = Number(req.params.newsId);


        const getMediaUseCase = new GetMediaByNewsIdUseCase(this.mediaRepository);
        const mediaList = await getMediaUseCase.execute(newsId);
        return res.status(200).json(mediaList);
    }
     async deleteMedia(req: Request, res: Response) {
        const mediaId = Number(req.params.mediaId);
        if (isNaN(mediaId)) {
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