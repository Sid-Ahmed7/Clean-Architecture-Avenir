
CREATE TYPE transaction_type_enum AS ENUM ('TRANSFER', 'WITHDRAWAL', 'DEPOSIT', 'PAYMENT', 'FEE', 'INTEREST');
CREATE TYPE transfer_status_enum AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE order_status_enum AS ENUM ('PENDING', 'EXECUTED', 'CANCELLED', 'FAILED', 'PARTIALLY_EXECUTED');

CREATE TABLE IF NOT EXISTS transactions (
    transaction_reference VARCHAR(255) PRIMARY KEY,
    debit_account BIGINT NOT NULL,
    credit_account BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    transaction_type transaction_type_enum NOT NULL,
    executed_by VARCHAR(255) NOT NULL,
    status transfer_status_enum DEFAULT 'PENDING' NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    debit_user_id VARCHAR(255),
    credit_user_id VARCHAR(255),
    debit_user_name VARCHAR(255),
    credit_user_name VARCHAR(255),

    FOREIGN KEY (debit_account) REFERENCES accounts(account_number) ON DELETE RESTRICT,
    FOREIGN KEY (credit_account) REFERENCES accounts(account_number) ON DELETE RESTRICT,
    FOREIGN KEY (executed_by) REFERENCES bank_users(id) ON DELETE RESTRICT
);


CREATE INDEX idx_transactions_debit_account ON transactions(debit_account);
CREATE INDEX idx_transactions_credit_account ON transactions(credit_account);
CREATE INDEX idx_transactions_executed_by ON transactions(executed_by);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
