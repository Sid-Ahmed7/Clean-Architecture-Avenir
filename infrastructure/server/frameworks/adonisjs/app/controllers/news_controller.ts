import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { CreateNewsUseCase } from "#application/usecases/news/CreateNewsUseCase.js";
import { UpdateNewsUseCase } from "#application/usecases/news/UpdateNewsUseCase.js";
import { DeleteNewsUseCase } from "#application/usecases/news/DeleteNewsUseCase.js";
import { GetNewsByIdUseCase } from "#application/usecases/news/GetNewsByIdUseCase.js";
import { GetAllNewsUseCase } from "#application/usecases/news/GetAllNewsUseCase.js";
import type { NewsRepositoryInterface } from "#application/ports/repositories/news/NewsRepositoryInterface.js";
import type { CryptoUuidGenerator } from "#infrastructure/adapters/services/CryptoUuidGenerator.js";
import { NewsNotFoundError } from "#application/errors/NewsNotFoundError.js";
import { InvalidNewsError } from "#domain/errors/InvalidNewsError.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as newsValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/news.js";
import { NotificationService } from '#infrastructure/adapters/services/notification/NotificationService.js';

@inject()
export default class NewsController {
  constructor(
    private readonly newsRepository: NewsRepositoryInterface,
    private readonly notificationService: NotificationService,
    private readonly uuidService: CryptoUuidGenerator
  ) {}

  async create({ request, response }: HttpContext) {
    const createNewsUseCase = new CreateNewsUseCase(this.newsRepository, this.notificationService,this.uuidService);
    const input = await vine.validate({schema: newsValidator.createNewsValidator, data: request.body()});

    const result = await createNewsUseCase.execute(input);
    if (result instanceof Error) {
      if (result instanceof InvalidNewsError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async update({ request, response }: HttpContext) {
    const updateNewsUseCase = new UpdateNewsUseCase(this.newsRepository, this.notificationService);
    const input = await vine.validate({schema: newsValidator.updateNewsValidator, data: request.body()});

    const result = await updateNewsUseCase.execute(input);
    if (result instanceof Error) {
      if (result instanceof NewsNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      if (result instanceof InvalidNewsError) {
        return response.status(400).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async delete({ request, response }: HttpContext) {
    const deleteNewsUseCase = new DeleteNewsUseCase(this.newsRepository, this.notificationService);
    const id = request.param('id');

    if (!id) {
      return response.status(400).json({ error: "News ID is required" });
    }

    const result = await deleteNewsUseCase.execute(id);
    if (result instanceof Error) {
      if (result instanceof NewsNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(204).json({});
  }

  async getById({ request, response }: HttpContext) {
    const getNewsUseCase = new GetNewsByIdUseCase(this.newsRepository);
    const id = request.param('id');

    if (!id) {
      return response.status(400).json({ error: "News ID is required" });
    }

    const result = await getNewsUseCase.execute(id);
    if (result instanceof Error) {
      if (result instanceof NewsNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async getAll({ response }: HttpContext) {
    const getAllNewsUseCase = new GetAllNewsUseCase(this.newsRepository);
    const newsList = await getAllNewsUseCase.execute();
    return response.status(200).json(newsList);
  }

  async subscribe({ request, response, auth }: HttpContext) {
    const userId = auth?.userId;

    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    response.response.writeHead(200, {
      'Access-Control-Allow-Origin': process.env.CLIENT_BASE_URL || '*',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });

    const client = {
      write: (data: string) => response.response.write(data),
      close: () => response.response.end()
    };

    this.notificationService.subscribe(userId, client);

    request.request.on('close', () => {
      this.notificationService.unsubscribe(userId, client);
    });
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
