CREATE TABLE IF NOT EXISTS group_conversations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by VARCHAR(255) NOT NULL REFERENCES bank_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_participants (
    id UUID PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES group_conversations(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES bank_users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('BANK_ADVISOR', 'BANK_MANAGER')),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS group_messages (
    id UUID PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES group_conversations(id) ON DELETE CASCADE,
    sender_id VARCHAR(255) NOT NULL REFERENCES bank_users(id),
    sender_role VARCHAR(50) NOT NULL,
    sender_first_name VARCHAR(100) NOT NULL,
    sender_last_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_by VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[]
);

CREATE INDEX idx_group_messages_group_id ON group_messages(group_id);
CREATE INDEX idx_group_messages_created_at ON group_messages(created_at);
CREATE INDEX idx_group_participants_group_id ON group_participants(group_id);
CREATE INDEX idx_group_participants_user_id ON group_participants(user_id);
