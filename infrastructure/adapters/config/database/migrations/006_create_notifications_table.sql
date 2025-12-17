CREATE TYPE read_status_enum AS ENUM ('UNREAD', 'READ');

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_status read_status_enum DEFAULT 'UNREAD' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    read_at TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES bank_users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_status ON notifications(read_status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
