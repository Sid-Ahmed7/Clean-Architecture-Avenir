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

export interface CreateNews {
    title: string;
    content: string;
    category: NewsCategoryEnum;
    priority: NewsPriorityEnum;
    tags: string[];
}