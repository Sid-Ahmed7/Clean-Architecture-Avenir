import { MediaTypeEnum } from '#config/enums.js'
import vine from '@vinejs/vine'

export const createMediaValidator = vine.object({
  newsId: vine.string(),
  url: vine.string(),
  type: vine.enum(Object.values(MediaTypeEnum)),
  order: vine.number(),
  altText: vine.string(),
  caption: vine.string(),
  size: vine.number(),
  mimeType: vine.string()
})

export const updateMediaValidator = vine.object({
  caption: vine.string().optional(),
  altText: vine.string().optional(),
  order: vine.number().optional()
})
