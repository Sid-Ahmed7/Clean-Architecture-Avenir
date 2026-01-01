import { MediaTypeEnum } from '#domain/enums/MediaTypeEnum.js'
import vine from '@vinejs/vine'

export const createMediaValidator = vine.object({
  newsId: vine.string(),
  url: vine.string(),
  type: vine.enum(Object.values(MediaTypeEnum)),
  caption: vine.string(),
  altText: vine.string(),
  size: vine.number(),
  mimeType: vine.string()
})

export const updateMediaValidator = vine.object({
  id: vine.string(),
  caption: vine.string().optional(),
  altText: vine.string().optional(),
  order: vine.number().optional()
})
