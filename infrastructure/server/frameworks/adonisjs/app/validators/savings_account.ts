import vine from '@vinejs/vine'

export const createSavingsAccountValidator = vine.object({
  accountNumber: vine.number(),
  productId: vine.string(),
  userId: vine.string(),
  interestRate: vine.number(),
  maxDepositAmount: vine.number().nullable().optional(),
  maturity: vine.date().optional()
})

export const updateSavingsAccountConfigValidator = vine.object({
  interestRate: vine.number().optional(),
  maxDepositAmount: vine.number().nullable().optional(),
  isActive: vine.boolean().optional()
})

export const updateInterestRateValidator = vine.object({
  interestRate: vine.number()
})

export const updateMaxDepositValidator = vine.object({
  maxDepositAmount: vine.number().nullable()
})

export const depositToSavingsAccountValidator = vine.object({
  amount: vine.number()
})

export const withdrawFromSavingsAccountValidator = vine.object({
  amount: vine.number()
})
