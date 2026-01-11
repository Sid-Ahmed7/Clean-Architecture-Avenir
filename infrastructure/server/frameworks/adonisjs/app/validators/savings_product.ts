import vine from '@vinejs/vine'

export const createSavingsProductValidator = vine.object({
  name: vine.string(),
  description: vine.string(),
  interestRate: vine.number(),
  maxDepositAmount: vine.number().nullable().optional(),
  minDepositAmount: vine.number().nullable().optional()
})

export const updateSavingsProductValidator = vine.object({
  interestRate: vine.number().optional(),
  maxDepositAmount: vine.number().nullable().optional(),
  minDepositAmount: vine.number().nullable().optional(),
  isActive: vine.boolean().optional()
})

export const subscribeToProductValidator = vine.object({
  productId: vine.string(),
  initialDeposit: vine.number().optional()
})
