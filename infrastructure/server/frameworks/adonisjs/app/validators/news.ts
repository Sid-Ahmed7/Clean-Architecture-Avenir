import { NewsCategoryEnum } from '#domain/enums/NewsCategoryEnum.js'
import { NewsPriorityEnum } from '#domain/enums/NewsPriorityEnum.js'
import vine from '@vinejs/vine'

export const createNewsValidator = vine.object({
  title: vine.string(),
  category: vine.enum(Object.values(NewsCategoryEnum)),
  priority: vine.enum(Object.values(NewsPriorityEnum)),
  tags: vine.array(vine.string())
})

export const updateNewsValidator = vine.object({
  id: vine.string(),
  title: vine.string(),
  category: vine.enum(Object.values(NewsCategoryEnum)),
  priority: vine.enum(Object.values(NewsPriorityEnum)),
  tags: vine.array(vine.string()),
  published: vine.boolean().optional()
})
