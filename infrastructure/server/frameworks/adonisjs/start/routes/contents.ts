import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import ContentsController from '#controllers/contents_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '#domain/enums/RoleEnum.js'
import * as repositories from '#config/repositories.js'

const contentsController = new ContentsController(
  repositories.contentRepository,
  repositories.orderService,
  repositories.uuidService
)

router
  .group(() => {
    router
      .post('/create', (ctx) => contentsController.create(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

    router
      .get('/:id', (ctx) => contentsController.getById(ctx))
      .use(middleware.auth())

    router
      .get('/news/:newsId', (ctx) => contentsController.getByNewsId(ctx))
      .use(middleware.auth())

    router
      .put('/update', (ctx) => contentsController.update(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

    router
      .delete('/:id', (ctx) => contentsController.delete(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

    router
      .post('/reorder/:newsId', (ctx) => contentsController.reorder(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))
  })
  .prefix('/api/contents')
