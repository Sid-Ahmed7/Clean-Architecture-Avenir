
CREATE TABLE IF NOT EXISTS savings_accounts (
    account_number BIGINT PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 0 AND interest_rate <= 100),
    max_deposit_amount DECIMAL(15,2),
    total_interest_earned DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00 NOT NULL,
    last_balance_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_interest_applied TIMESTAMP,
    maturity TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (account_number) REFERENCES accounts(account_number) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES savings_products(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES bank_users(id) ON DELETE CASCADE
);


CREATE INDEX idx_savings_accounts_user_id ON savings_accounts(user_id);
CREATE INDEX idx_savings_accounts_product_id ON savings_accounts(product_id);
CREATE INDEX idx_savings_accounts_is_active ON savings_accounts(is_active);
CREATE INDEX idx_savings_accounts_maturity ON savings_accounts(maturity);
