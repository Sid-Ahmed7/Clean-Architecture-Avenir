import { LoanDecisionEnum } from '#domain/enums/LoanDecisionEnum.js'
import vine from '@vinejs/vine'

export const createLoanRequestValidator = vine.object({
  advisorId: vine.string(),
  amount: vine.number(),
  purpose: vine.string(),
  durationMonths: vine.number()
})

export const decideLoanRequestValidator = vine.object({
  decision: vine.enum(LoanDecisionEnum)
})

export const proposeRateValidator = vine.object({
  rate: vine.number()
})

export const setRateValidator = vine.object({
  rate: vine.number()
})
