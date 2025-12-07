export enum NewsCategoryEnum {
    OFFER = 'OFFER',
    SECURITY = 'SECURITY',
    SAVINGS = 'SAVINGS',
    INVESTMENT = 'INVESTMENT',
    CREDIT = 'CREDIT'
};
export enum NewsPriorityEnum {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export interface News {
    id: string;
    title: string;
    category: NewsCategoryEnum;
    priority: NewsPriorityEnum;
    tags: string[];
    createdAt: string;
    updatedAt?: string;
}