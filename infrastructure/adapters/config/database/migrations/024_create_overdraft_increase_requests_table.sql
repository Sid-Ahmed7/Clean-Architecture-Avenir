CREATE TYPE overdraft_request_status_enum AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);

CREATE TABLE IF NOT EXISTS overdraft_increase_requests (
    id VARCHAR(255) PRIMARY KEY,
    account_number BIGINT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    current_overdraft_limit DECIMAL(15,2) NOT NULL,
    requested_overdraft_limit DECIMAL(15,2) NOT NULL,
    status overdraft_request_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_overdraft_request_user
        FOREIGN KEY (user_id)
        REFERENCES bank_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_overdraft_request_account
        FOREIGN KEY (account_number)
        REFERENCES accounts(account_number)
        ON DELETE CASCADE
);


CREATE INDEX idx_overdraft_requests_user_id
    ON overdraft_increase_requests(user_id);

CREATE INDEX idx_overdraft_requests_account_number
    ON overdraft_increase_requests(account_number);

CREATE INDEX idx_overdraft_requests_status
    ON overdraft_increase_requests(status);

CREATE INDEX idx_overdraft_requests_created_at
    ON overdraft_increase_requests(created_at DESC);
