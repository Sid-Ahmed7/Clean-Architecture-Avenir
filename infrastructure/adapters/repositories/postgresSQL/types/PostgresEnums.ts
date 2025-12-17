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
