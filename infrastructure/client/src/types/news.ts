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
    id: number;
    title: string;
    content: string;
    category: NewsCategoryEnum;
    priority: NewsPriorityEnum;
    tags: string[];
    views: number;
    createdAt: string;
    updatedAt?: string;
}