import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateContentUseCase } from "#application/usecases/news/content/CreateContentUseCase.js";
import { GetContentByIdUseCase } from "#application/usecases/news/content/GetContentByIdUseCase.js";
import { GetContentsByNewsIdUseCase } from "#application/usecases/news/content/GetContentsByNewsIdUseCase.js";
import { UpdateContentUseCase } from "#application/usecases/news/content/UpdateContentUseCase.js";
import { DeleteContentUseCase } from "#application/usecases/news/content/DeleteContentUseCase.js";
import { ReorderContentsUseCase } from "#application/usecases/news/content/ReorderContentsUseCase.js";
import type { ContentRepositoryInterface } from "#application/ports/repositories/news/ContentRepositoryInterface.js";
import type { ManageOrderService } from "#infrastructure/adapters/services/news/ManageOrderService.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import { InvalidContentError } from "#domain/errors/InvalidContentError.js";
import { ContentNotFoundError } from "#application/errors/ContentNotFoundError.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as contentValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/content.js";

@inject()
export default class ContentsController {
  constructor(
    private readonly contentRepository: ContentRepositoryInterface,
    private readonly orderService: ManageOrderService,
    private readonly uuidService: CryptoUuidGenerator
  ) {}

  async create({ request, response }: HttpContext) {
    const createContentUseCase = new CreateContentUseCase(
      this.contentRepository,
      this.orderService,
      this.uuidService
    );

    const input = await vine.validate({schema: contentValidator.createContentValidator, data: request.body()});

    const result = await createContentUseCase.execute({ newsId: input.newsId, content: input.content });
    if (result instanceof Error) {
      if (result instanceof InvalidContentError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }
    return response.status(201).json(result);
  }

  async getById({ request, response }: HttpContext) {
    const getContentByIdUseCase = new GetContentByIdUseCase(this.contentRepository);
    const id = request.param('id');
    if (!id) {
      return response.status(400).json({ error: "Content ID is required" });
    }

    const result = await getContentByIdUseCase.execute(id);

    if (result instanceof Error) {
      if (result instanceof ContentNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }
    return response.status(200).json(result);
  }

  async getByNewsId({ request, response }: HttpContext) {
    const useCase = new GetContentsByNewsIdUseCase(this.contentRepository);
    const newsId = request.param('newsId');
    if (!newsId) {
      return response.status(400).json({ error: "News ID is required" });
    }

    const result = await useCase.execute(newsId);
    return response.json(result);
  }

  async update({ request, response }: HttpContext) {
    const updateContentUseCase = new UpdateContentUseCase(this.contentRepository);
    const input = await vine.validate({schema: contentValidator.updateContentValidator, data: request.body()});

    const result = await updateContentUseCase.execute(input);
    if (result instanceof Error) {
      if (result instanceof ContentNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }
    return response.status(200).json(result);
  }

  async delete({ request, response }: HttpContext) {
    const deleteContentUseCase = new DeleteContentUseCase(this.contentRepository);
    const id = request.param('id');
    if (!id) {
      return response.status(400).json({ error: "Content ID is required" });
    }

    const result = await deleteContentUseCase.execute(id);
    if (result instanceof Error) {
      if (result instanceof ContentNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }
    return response.status(204).json({});
  }

  async reorder({ request, response }: HttpContext) {
    const reorderContentsUseCase = new ReorderContentsUseCase(this.contentRepository);

    const newsId = request.param('newsId');

    if (!newsId) {
      return response.status(400).json({ error: "NewsId ID is required" });
    }

    const input = await vine.validate({schema: contentValidator.reorderContentValidator, data: request.body()});
    const result = await reorderContentsUseCase.execute(newsId, input.newOrder);

    if (result instanceof Error) {
      if (result instanceof ContentNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }
    return response.status(200).json(result);
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
