import { AccountStatusEnum } from '#domain/enums/AccountStatusEnum.js'
import { AccountTypeEnum } from '#domain/enums/AccountTypeEnum.js'
import vine from '@vinejs/vine'


export const changeAccountValidator = vine.object({
  status: vine.enum(AccountStatusEnum)
})

export const createAccountValidator = vine.object({
  accountType: vine.enum(AccountTypeEnum),
  currency: vine.enum(['EUR']),
  customAccountName: vine.string().optional()
})

export const createSubAccountValidator = vine.object({
  accountType: vine.enum(AccountTypeEnum),
  currency: vine.enum(['EUR']),
  customAccountName: vine.string().optional(),
  parentAccountId: vine.number()
})

export const updateAccountNameValidator = vine.object({
  customAccountName: vine.string()
})

export const updateWithdrawalLimitValidator = vine.object({
  withdrawalLimit: vine.number()
})

export const updateTransferLimitValidator = vine.object({
  transferLimit: vine.number()
})

export const updateOverdraftLimitValidator = vine.object({
  overdraftLimit: vine.number()
})

export const requestOverdraftIncreaseValidator = vine.object({
  overdraftLimit: vine.number()
})

export const respondOverdraftIncreaseValidator = vine.object({
  action: vine.enum(['APPROVE', 'REJECT'])
})

export const toggleAccountActiveValidator = vine.object({
  isActive: vine.boolean()
})

export const transferBetweenAccountsValidator = vine.object({
  fromIban: vine.string(),
  toIban: vine.string(),
  amount: vine.number()
})

export const updateAccountValidator = vine.object({
  accountNumber: vine.number(),
  iban: vine.string(),
  userId: vine.string(),
  accountType: vine.enum(AccountTypeEnum),
  currentBalance: vine.number(),
  currency: vine.string(),
  accountStatus: vine.enum(AccountStatusEnum),
  isActive: vine.boolean(),
  createdAt: vine.date(),
  withdrawalLimit: vine.number(),
  transferLimit: vine.number(),
  overdraftLimit: vine.number(),
  customAccountName: vine.string(),
  totalTransfered: vine.number(),
  lastTransferResetDate: vine.date(),
  parentAccountId: vine.number().optional(),
  closedAt: vine.date().optional()
})

export const transferToBeneficiaryValidator = vine.object({
  beneficiaryId: vine.string(),
  sourceAccountNumber: vine.number(),
  amount: vine.number()
})

export const transferToGroupValidator = vine.object({
  groupId: vine.string(),
  sourceAccountNumber: vine.number(),
  amountPerBeneficiary: vine.number()
})
