import router from '@adonisjs/core/services/router'
import MediaController from '#controllers/media_controller.js'
import app from '@adonisjs/core/services/app'


const getMediaController = (async () => {
  return new MediaController(
    await app.container.make('mediaRepository'),
    await app.container.make('newsRepository'),
    await app.container.make('fileStorageService'),
    await app.container.make('orderService'),
    await app.container.make('altService'),
    await app.container.make('uuidService')
  )
})()

router
  .group(() => {
    router.post('/upload', async (ctx) => (await getMediaController).uploadMedia(ctx))

    router.get('/news/:newsId', async (ctx) => (await getMediaController).getMediaByNewsId(ctx))

    router.put('/update', async (ctx) => (await getMediaController).updateMedia(ctx))

    router.delete('/:mediaId', async (ctx) => (await getMediaController).deleteMedia(ctx))
  })
  .prefix('/api/media')
