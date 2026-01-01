import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { UploadMediaUseCase } from "#application/usecases/news/upload/UploadMediaUseCase.js";
import { UpdateMediaUseCase } from "#application/usecases/news/upload/UpdateMediaUseCase.js";
import { CreateMediaUseCase } from "#application/usecases/news/upload/CreateMediaUseCase.js";
import { GetMediaByNewsIdUseCase } from "#application/usecases/news/upload/GetMediaByNewsIdUseCase.js";
import { DeleteMediaUseCase } from "#application/usecases/news/upload/DeleteMediaUseCase.js";
import type { MediaRepositoryInterface } from "#application/ports/repositories/news/MediaRepositoryInterface.js";
import type { NewsRepositoryInterface } from "#application/ports/repositories/news/NewsRepositoryInterface.js";
import type { LocalFileStorageService } from "#infrastructure/adapters/services/news/LocalFileStorageService.js";
import type { ManageOrderService } from "#infrastructure/adapters/services/news/ManageOrderService.js";
import type { GenerateAltTextService } from "#infrastructure/adapters/services/news/GenerateAltTextService.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import { MediaTypeEnum } from "#domain/enums/MediaTypeEnum.js";
import { MediaNotFoundError } from "#application/errors/MediaNotFoundError.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as mediaValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/media.js";

@inject()
export default class MediaController {
  constructor(
    private readonly mediaRepository: MediaRepositoryInterface,
    private readonly newsRepository: NewsRepositoryInterface,
    private readonly fileStorageService: LocalFileStorageService,
    private readonly orderService: ManageOrderService,
    private readonly altService: GenerateAltTextService,
    private readonly uuidService: CryptoUuidGenerator
  ) {}

  async uploadMedia({ request, response }: HttpContext) {
    const file = request.file('file');
    if (!file) {
      return response.status(400).json({ error: "No file provided" });
    }

    const uploadMediaUseCase = new UploadMediaUseCase(this.fileStorageService);
    const fs = await import('fs');
    const buffer = fs.readFileSync(file.tmpPath!);
    const uploadFile = await uploadMediaUseCase.execute(
      buffer,
      file.clientName,
      file.type || ''
    );

    if (uploadFile instanceof Error) {
      return response.status(500).json({ error: uploadFile.message });
    }

    const body = request.body();
    const mediaType = file.type?.startsWith("image/") ? MediaTypeEnum.IMAGE : MediaTypeEnum.VIDEO;
    const mediaEntity = {
      newsId: body.newsId,
      url: uploadFile.url,
      type: mediaType,
      altText: body.altText || "",
      size: uploadFile.size,
      mimeType: uploadFile.mimeType,
      caption: body.caption ?? "",
    };

    const createMediaUseCase = new CreateMediaUseCase(
      this.mediaRepository,
      this.newsRepository,
      this.orderService,
      this.altService,
      this.uuidService
    );

    const createdMedia = await createMediaUseCase.execute(mediaEntity);
    if (createdMedia instanceof Error) {
      return response.status(500).json({ error: createdMedia.message });
    }

    return response.status(201).json(createdMedia);
  }

  async getMediaByNewsId({ request, response }: HttpContext) {
    const newsId = request.param('newsId');
    if (!newsId) {
      return response.status(400).json({ error: "News ID is required" });
    }

    const getMediaUseCase = new GetMediaByNewsIdUseCase(this.mediaRepository);
    const mediaList = await getMediaUseCase.execute(newsId);
    return response.status(200).json(mediaList);
  }

  async updateMedia({ request, response }: HttpContext) {
    const updateMediaUseCase = new UpdateMediaUseCase(this.mediaRepository);
    const input = await vine.validate({schema: mediaValidator.updateMediaValidator, data: request.body()});
    const result = await updateMediaUseCase.execute(input);

    if (result instanceof Error) {
      if (result instanceof MediaNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async deleteMedia({ request, response }: HttpContext) {
    const mediaId = request.param('mediaId');
    if (!mediaId) {
      return response.status(400).json({ error: "Invalid mediaId" });
    }

    const deleteMediaUseCase = new DeleteMediaUseCase(
      this.mediaRepository,
      this.newsRepository,
      this.fileStorageService
    );
    const result = await deleteMediaUseCase.execute(mediaId);

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(204).json({});
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
