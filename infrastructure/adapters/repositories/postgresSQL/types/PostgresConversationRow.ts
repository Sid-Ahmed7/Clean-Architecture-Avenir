
export interface PostgresConversationRow {
    id: string;
    client_id: string;
    advisor_id: string | null;
    created_at: Date;
}
