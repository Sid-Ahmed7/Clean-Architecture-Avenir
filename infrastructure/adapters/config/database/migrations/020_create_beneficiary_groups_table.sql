CREATE TABLE IF NOT EXISTS beneficiary_groups (
    group_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_beneficiary_groups_user
        FOREIGN KEY (user_id)
        REFERENCES bank_users(id)
        ON DELETE CASCADE
);
CREATE INDEX idx_beneficiary_groups_user_id
    ON beneficiary_groups(user_id);