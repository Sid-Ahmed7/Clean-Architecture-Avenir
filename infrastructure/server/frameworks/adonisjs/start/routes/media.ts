import router from '@adonisjs/core/services/router'
import MediaController from '#controllers/media_controller.js'
import * as repositories from '#config/repositories.js'

const mediaController = new MediaController(
  repositories.mediaRepository,
  repositories.newsRepository,
  repositories.fileStorageService,
  repositories.orderService,
  repositories.altService,
  repositories.uuidService
)

router
  .group(() => {
    router.post('/upload', (ctx) => mediaController.uploadMedia(ctx))

    router.get('/news/:newsId', (ctx) => mediaController.getMediaByNewsId(ctx))

    router.put('/update', (ctx) => mediaController.updateMedia(ctx))

    router.delete('/:mediaId', (ctx) => mediaController.deleteMedia(ctx))
  })
  .prefix('/api/media')
