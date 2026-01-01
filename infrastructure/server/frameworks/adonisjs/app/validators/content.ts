import vine from '@vinejs/vine'

export const createContentValidator = vine.object({
  newsId: vine.string(),
  content: vine.string()
})

export const reorderContentValidator = vine.object({
  newOrder: vine.array(vine.string())
})

export const updateContentValidator = vine.object({
  id: vine.string(),
  content: vine.string(),
  order: vine.number().optional(),
  newsId: vine.string()
})
