import vine from '@vinejs/vine'


export const registerValidator = vine.object({
  email: vine.string(),
  password: vine.string(),
  firstName: vine.string(),
  lastName: vine.string(),
  phoneNumber: vine.string(),
  dateOfBirth: vine.date(),
  address: vine.string()
})

export const registerAdvisorValidator = vine.object({
  email: vine.string(),
  password: vine.string(),
  firstName: vine.string(),
  lastName: vine.string(),
  phoneNumber: vine.string(),
  dateOfBirth: vine.date(),
  address: vine.string()
})

export const registerManagerValidator = vine.object({
  email: vine.string(),
  password: vine.string(),
  firstName: vine.string(),
  lastName: vine.string(),
  phoneNumber: vine.string(),
  dateOfBirth: vine.date(),
  address: vine.string()
})

export const loginValidator = vine.object({
  email: vine.string(),
  password: vine.string()
})

export const updateUserValidator = vine.object({
  email: vine.string().optional(),
  firstName: vine.string().optional(),
  lastName: vine.string().optional(),
  phoneNumber: vine.string().optional(),
  address: vine.string().optional(),
  status: vine.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional()
})

