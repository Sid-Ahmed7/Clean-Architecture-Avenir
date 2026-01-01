import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import NewsController from '#controllers/news_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const newsController = new NewsController(
  repositories.newsRepository,
  repositories.notificationService,
  repositories.uuidService
)

router
  .group(() => {
    router
      .get('/stream', (ctx) => newsController.subscribe(ctx))
      .use(middleware.auth())

    router
      .post('/create', (ctx) => newsController.create(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .get('/', (ctx) => newsController.getAll(ctx))
      .use(middleware.auth())

    router
      .get('/:id', (ctx) => newsController.getById(ctx))
      .use(middleware.auth())

    router
      .put('/update', (ctx) => newsController.update(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .delete('/delete/:id', (ctx) => newsController.delete(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

  })
  .prefix('/api/news')
