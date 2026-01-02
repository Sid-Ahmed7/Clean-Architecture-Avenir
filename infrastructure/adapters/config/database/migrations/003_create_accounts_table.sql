CREATE TYPE account_status_enum AS ENUM (
    'ACTIVE',
    'CLOSED',
    'SUSPENDED',
    'PENDING',
    'FROZEN',
    'BANNED'
);
CREATE TYPE account_type_enum AS ENUM (
    'SAVINGS',
    'CHECKING'
);

CREATE TABLE IF NOT EXISTS accounts (
    account_number BIGSERIAL PRIMARY KEY,
    iban VARCHAR(34) UNIQUE NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    account_type account_type_enum NOT NULL,
    current_balance DECIMAL(15,2) DEFAULT 20.00 NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR' NOT NULL,
    account_status account_status_enum DEFAULT 'PENDING' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    withdrawal_limit DECIMAL(15,2) DEFAULT 3000.00,
    transfer_limit DECIMAL(15,2) DEFAULT 3000.00,
    overdraft_limit DECIMAL(15,2) DEFAULT 1000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    custom_account_name VARCHAR(255),
    total_transfered DECIMAL(15,2) DEFAULT 0.00,
    last_transfer_reset_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_account_id BIGINT,
    closed_at TIMESTAMP,
    blocked_balanced DECIMAL(15,2) DEFAULT 0.00,

    FOREIGN KEY (user_id) REFERENCES bank_users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_account_id) REFERENCES accounts(account_number) ON DELETE SET NULL
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_iban ON accounts(iban);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_accounts_account_status ON accounts(account_status);
CREATE INDEX idx_accounts_parent_account_id ON accounts(parent_account_id);
