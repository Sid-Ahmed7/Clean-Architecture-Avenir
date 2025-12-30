import { MediaTypeEnum } from '#domain/enums/MediaTypeEnum.js'
import vine from '@vinejs/vine'

export const createMediaValidator = vine.object({
  newsId: vine.string(),
  url: vine.string(),
  type: vine.enum(MediaTypeEnum),
  caption: vine.string(),
  altText: vine.string(),
  size: vine.number(),
  mimeType: vine.string()
})
