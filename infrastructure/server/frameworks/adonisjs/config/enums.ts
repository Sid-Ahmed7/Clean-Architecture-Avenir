export const RoleEnum = {
  CLIENT: 'CLIENT',
  BANK_ADVISOR: 'BANK_ADVISOR',
  BANK_MANAGER: 'BANK_MANAGER',
} as const

export const UserStatusEnum = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  INACTIVE: 'INACTIVE',
  BANNED: 'BANNED',
} as const

export const AccountStatusEnum = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
  SUSPENDED: 'SUSPENDED',
  PENDING: 'PENDING',
  FROZEN: 'FROZEN',
  BANNED: 'BANNED',
} as const

export const AccountTypeEnum = {
  SAVINGS: 'SAVINGS',
  CHECKING: 'CHECKING',
} as const

export const MediaTypeEnum = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const

export const NewsCategoryEnum = {
  OFFER: 'OFFER',
  SECURITY: 'SECURITY',
  SAVINGS: 'SAVINGS',
  INVESTMENT: 'INVESTMENT',
  CREDIT: 'CREDIT',
} as const

export const NewsPriorityEnum = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const

export const OrderTypeEnum = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const

export const LoanDecisionEnum = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
} as const

export const NotificationTypeEnum = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
} as const

export const LoanStatusEnum = {
  PENDING: 'PENDING',
  ADVISOR_APPROVED: 'ADVISOR_APPROVED',
  ADVISOR_REJECTED: 'ADVISOR_REJECTED',
  DIRECTOR_APPROVED: 'DIRECTOR_APPROVED',
  DIRECTOR_REJECTED: 'DIRECTOR_REJECTED',
  RATE_PROPOSED: 'RATE_PROPOSED',
  CLIENT_REJECTED: 'CLIENT_REJECTED',
  DISBURSED: 'DISBURSED',
  PAID_OFF: 'PAID_OFF',
} as const

export const TransactionTypeEnum = {
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  TRANSFER: 'TRANSFER',
  PAYMENT: 'PAYMENT',
  FEE: 'FEE',
  INTEREST: 'INTEREST',
  BENEFICIARY: 'BENEFICIARY',
  GROUP: 'GROUP',
} as const
