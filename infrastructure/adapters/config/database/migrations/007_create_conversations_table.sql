
CREATE TABLE IF NOT EXISTS conversations (
    id VARCHAR(255) PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL,
    advisor_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    FOREIGN KEY (client_id) REFERENCES bank_users(id) ON DELETE CASCADE,
    FOREIGN KEY (advisor_id) REFERENCES bank_users(id) ON DELETE SET NULL
);

CREATE INDEX idx_conversations_client_id ON conversations(client_id);
CREATE INDEX idx_conversations_advisor_id ON conversations(advisor_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);
