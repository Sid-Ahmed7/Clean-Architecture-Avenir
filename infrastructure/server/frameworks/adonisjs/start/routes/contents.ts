import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import ContentsController from '#controllers/contents_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getContentsController = (async () => {
  return new ContentsController(
    await app.container.make('contentRepository'),
    await app.container.make('orderService'),
    await app.container.make('uuidService')
  )
})()

router
  .group(() => {
    router
      .post('/create', async (ctx) => (await getContentsController).create(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

    router
      .get('/:id', async (ctx) => (await getContentsController).getById(ctx))
      .use(middleware.auth())

    router
      .get('/news/:newsId', async (ctx) => (await getContentsController).getByNewsId(ctx))
      .use(middleware.auth())

    router
      .put('/update', async (ctx) => (await getContentsController).update(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

    router
      .delete('/:id', async (ctx) => (await getContentsController).delete(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

    router
      .post('/reorder/:newsId', async (ctx) => (await getContentsController).reorder(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))
  })
  .prefix('/api/content')
