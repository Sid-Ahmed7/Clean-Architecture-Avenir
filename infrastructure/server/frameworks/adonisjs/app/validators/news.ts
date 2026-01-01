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
  title: vine.string().optional(),
  category: vine.enum(Object.values(NewsCategoryEnum)).optional(),
  priority: vine.enum(Object.values(NewsPriorityEnum)).optional(),
  tags: vine.array(vine.string()).optional(),
  published: vine.boolean().optional()
})
