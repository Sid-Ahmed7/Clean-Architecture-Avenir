import { ReadStatusEnum } from "./PostgresEnums";


export interface PostgresMessageRow {
    id: string;
    conversation_id: string;
    conversation_client_id: string;
    conversation_advisor_id: string | null;
    author_id: string;
    content: string;
    read_status: ReadStatusEnum;
    sent_at: Date;
}
