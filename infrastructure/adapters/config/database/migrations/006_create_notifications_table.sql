CREATE TYPE read_status_enum AS ENUM ('UNREAD', 'READ');

CREATE TYPE notification_type_enum AS ENUM (
    'INFO',
    'ALERT',
    'ACTION',
    'MESSAGING',
    'SYSTEM'
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read_status read_status_enum DEFAULT 'UNREAD' NOT NULL,
    type notification_type_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sender_id VARCHAR(255),
    sender_name VARCHAR(255),
    read_at TIMESTAMP,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES bank_users(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_notifications_user_id
    ON notifications(user_id);

CREATE INDEX idx_notifications_read_status
    ON notifications(read_status);

CREATE INDEX idx_notifications_type
    ON notifications(type);

CREATE INDEX idx_notifications_created_at
    ON notifications(created_at DESC);
