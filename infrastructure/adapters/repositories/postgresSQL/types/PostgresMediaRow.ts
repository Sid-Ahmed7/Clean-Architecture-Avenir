import { MediaTypeEnum } from "./PostgresEnums";

export interface PostgresMediaRow {
    id: string;
    news_id: string;
    url: string;
    type: MediaTypeEnum;
    order: number;
    alt_text: string;
    caption: string | null;
    size: number | null;
    mime_type: string | null;
    created_at: Date;
}
