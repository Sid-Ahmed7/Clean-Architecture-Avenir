import vine from '@vinejs/vine'
import { UserStatusEnum } from '#domain/enums/UserStatusEnum.js'

export const updateUserValidator = vine.object({
  email: vine.string().email().optional(),
  firstName: vine.string().optional(),
  lastName: vine.string().optional(),
  phoneNumber: vine.string().optional(),
  address: vine.string().optional(),
  status: vine.enum(UserStatusEnum).optional()
})

export const updateUserStatusValidator = vine.object({
  status: vine.enum(UserStatusEnum)
})

export const updateUserRoleValidator = vine.object({
  roleId: vine.string()
})

export const assignAdvisorToClientValidator = vine.object({
  clientId: vine.string(),
  advisorId: vine.string()
})
