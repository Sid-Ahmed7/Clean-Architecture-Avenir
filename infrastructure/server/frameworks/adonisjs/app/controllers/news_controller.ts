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
import { NewsService } from '#infrastructure/adapters/services/news/NewsService.js';

@inject()
export default class NewsController {
  constructor(
    private readonly newsRepository: NewsRepositoryInterface,
    private readonly newsService: NewsService,
    private readonly uuidService: CryptoUuidGenerator
  ) {}

  async create({ request, response }: HttpContext) {
    const createNewsUseCase = new CreateNewsUseCase(this.newsRepository, this.newsService, this.uuidService);
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
    const updateNewsUseCase = new UpdateNewsUseCase(this.newsRepository, this.newsService);
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
    const deleteNewsUseCase = new DeleteNewsUseCase(this.newsRepository, this.newsService);
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
    const request = arguments[0]?.request;
    const qs = request ? request.qs() : {};
    const filters: any = {};
    if (qs.category) {
      filters.category = qs.category;
    }
    if (qs.tags) {
      filters.tags = typeof qs.tags === 'string' ? qs.tags.split(',') : qs.tags;
    }
    if (qs.priority) {
      filters.priority = qs.priority;
    }
    const page = qs.page ? Number(qs.page) : 1;
    const limit = qs.limit ? Number(qs.limit) : 10;
    const newsList = await getAllNewsUseCase.execute(filters, page, limit);
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

    this.newsService.subscribe(client);

    request.request.on('close', () => {
      this.newsService.unsubscribe(client);
    });
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
