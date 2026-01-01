import { MediaTypeEnum } from '#domain/enums/MediaTypeEnum.js'
import vine from '@vinejs/vine'

export const createMediaValidator = vine.object({
  newsId: vine.string(),
  url: vine.string(),
  type: vine.enum(Object.values(MediaTypeEnum)),
  order: vine.number(),
  altText: vine.string(),
  caption: vine.string().optional(),
  size: vine.number().optional(),
  mimeType: vine.string().optional()
})

export const updateMediaValidator = vine.object({
  caption: vine.string().optional(),
  altText: vine.string().optional(),
  order: vine.number().optional()
})
