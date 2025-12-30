import { NotificationTypeEnum } from '#domain/enums/NotificationTypeEnum.js'
import vine from '@vinejs/vine'

export const createNotificationValidator = vine.object({
  message: vine.string(),
  type: vine.enum(NotificationTypeEnum)
})

export const markNotificationAsReadValidator = vine.object({
  notificationId: vine.string()
})

export const sendNotificationToClientValidator = vine.object({
  clientId: vine.string(),
  message: vine.string(),
  type: vine.enum(NotificationTypeEnum)
})
