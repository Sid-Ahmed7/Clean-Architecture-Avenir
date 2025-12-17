import { NewsCategoryEnum, NewsPriorityEnum } from "./PostgresEnums";


export interface PostgresNewsRow {
    id: string;
    title: string;
    category: NewsCategoryEnum;
    priority: NewsPriorityEnum;
    tags: string[];
    created_at: Date;
    updated_at: Date | null;
}
