import { NewsCategoryEnum } from '#domain/enums/NewsCategoryEnum.js'
import { NewsPriorityEnum } from '#domain/enums/NewsPriorityEnum.js'
import vine from '@vinejs/vine'

export const createNewsValidator = vine.object({
  title: vine.string(),
  category: vine.enum(NewsCategoryEnum),
  priority: vine.enum(NewsPriorityEnum),
  tags: vine.array(vine.string())
})
