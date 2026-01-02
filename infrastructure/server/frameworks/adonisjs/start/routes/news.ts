import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel.js'
import NewsController from '#controllers/news_controller.js'
import { authorizeRoles } from '#middleware/role_middleware.js'
import { RoleEnum } from '../../../../../../domain/enums/RoleEnum.js'
import app from '@adonisjs/core/services/app'


const getNewsController = (async () => {
  return new NewsController(
    await app.container.make('newsRepository'),
    await app.container.make('notificationService'),
    await app.container.make('uuidService')
  )
})()

router
  .group(() => {
    router
      .get('/stream', async (ctx) => (await getNewsController).subscribe(ctx))
      .use(middleware.auth())

    router
      .post('/create', async (ctx) => (await getNewsController).create(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .get('/', async (ctx) => (await getNewsController).getAll(ctx))
      .use(middleware.auth())

    router
      .get('/:id', async (ctx) => (await getNewsController).getById(ctx))
      .use(middleware.auth())

    router
      .put('/update', async (ctx) => (await getNewsController).update(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))


    router
      .delete('/delete/:id', async (ctx) => (await getNewsController).delete(ctx))
      .use(middleware.auth())
      .use(authorizeRoles([RoleEnum.BANK_ADVISOR]))

  })
  .prefix('/api/news')
