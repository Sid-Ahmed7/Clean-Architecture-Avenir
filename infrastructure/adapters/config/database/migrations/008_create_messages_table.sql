
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(255) PRIMARY KEY,
    conversation_id VARCHAR(255) NOT NULL,
    conversation_client_id VARCHAR(255) NOT NULL,
    conversation_advisor_id VARCHAR(255),
    author_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    read_status read_status_enum DEFAULT 'UNREAD' NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_client_id) REFERENCES bank_users(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_advisor_id) REFERENCES bank_users(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES bank_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_author_id ON messages(author_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at DESC);
CREATE INDEX idx_messages_read_status ON messages(read_status);
