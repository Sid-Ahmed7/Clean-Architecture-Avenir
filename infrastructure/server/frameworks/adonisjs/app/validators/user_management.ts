import vine from '@vinejs/vine'
import { UserStatusEnum } from '#config/enums.js'

export const updateUserValidator = vine.object({
  email: vine.string().optional(),
  firstName: vine.string().optional(),
  lastName: vine.string().optional(),
  phoneNumber: vine.string().optional(),
  address: vine.string().optional(),
  status: vine.enum(Object.values(UserStatusEnum)).optional()
})

export const updateUserStatusValidator = vine.object({
  status: vine.enum(Object.values(UserStatusEnum))
})

export const updateUserRoleValidator = vine.object({
  roleId: vine.string()
})

export const assignAdvisorToClientValidator = vine.object({
  clientId: vine.string(),
  advisorId: vine.string()
})
