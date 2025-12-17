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
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
    PARTIALLY_EXECUTED = 'PARTIALLY_EXECUTED'
}

export enum ReadStatusEnum {
    UNREAD = 'UNREAD',
    READ = 'READ'
}

export enum NewsCategoryEnum {
    FINANCE = 'FINANCE',
    ECONOMY = 'ECONOMY',
    TECHNOLOGY = 'TECHNOLOGY',
    MARKET = 'MARKET',
    REGULATION = 'REGULATION',
    GENERAL = 'GENERAL'
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

export enum IpoTypeEnum {
    INITIAL = 'INITIAL',
    SECONDARY = 'SECONDARY'
}

export enum OrderTypeEnum {
    BUY = 'BUY',
    SELL = 'SELL'
}
