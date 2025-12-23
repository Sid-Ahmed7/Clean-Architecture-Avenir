export enum UserStatusEnum {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED'
}

export enum AccountTypeEnum {
    CHECKING = 'CHECKING',
    SAVINGS = 'SAVINGS',
}

export enum AccountStatusEnum {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    CLOSED = 'CLOSED'
}

export enum TransactionTypeEnum {
    TRANSFER = 'TRANSFER',
    WITHDRAWAL = 'WITHDRAWAL',
    DEPOSIT = 'DEPOSIT',
    PAYMENT = 'PAYMENT',
    FEE = 'FEE',
    INTEREST = 'INTEREST'
}

export enum TransferStatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export enum OrderStatusEnum {
    PENDING = 'PENDING',
    EXECUTED = 'EXECUTED',
    PARTIALLY_EXECUTED ='PARTIALLY_EXECUTED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED',
}

export enum ReadStatusEnum {
    UNREAD = 'UNREAD',
    READ = 'READ'
}

export enum NewsCategoryEnum {
    OFFER = 'OFFER',
    SECURITY = 'SECURITY',
    SAVINGS = 'SAVINGS',
    INVESTMENT = 'INVESTMENT',
    CREDIT = 'CREDIT'
}

export enum NewsPriorityEnum {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT'
}

export enum MediaTypeEnum {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    DOCUMENT = 'DOCUMENT',
    AUDIO = 'AUDIO'
}

export enum IPOTypeEnum {
    INITIAL = 'INITIAL',
    SECONDARY = 'SECONDARY'
}

export enum OrderTypeEnum {
    BUY = 'BUY',
    SELL = 'SELL'
}

export enum RepaymentStatusEnum {
    PAYING = 'PAYING',
    PAID_OFF = 'PAID_OFF',
    FAILED = 'FAILED',
}
export enum LoanStatusEnum {
    PENDING = 'PENDING',
    ADVISOR_APPROVED = 'ADVISOR_APPROVED',
    ADVISOR_REJECTED = 'ADVISOR_REJECTED',
    DIRECTOR_APPROVED = 'DIRECTOR_APPROVED',
    DIRECTOR_REJECTED = 'DIRECTOR_REJECTED',
    RATE_PROPOSED = 'RATE_PROPOSED',
    CLIENT_REJECTED = 'CLIENT_REJECTED',
    DISBURSED = 'DISBURSED',
    PAID_OFF = 'PAID_OFF'
}

export enum OverdraftRequestStatusEnum {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum NotificationTypeEnum {
    INFO = "INFO",
    ALERT = "ALERT",
    ACTION = "ACTION",
    MESSAGING = "MESSAGING",
    SYSTEM = "SYSTEM"
}
