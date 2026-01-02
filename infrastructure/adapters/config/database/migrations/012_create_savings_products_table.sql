
CREATE TABLE IF NOT EXISTS savings_products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL CHECK (interest_rate >= 0 AND interest_rate <= 100),
    max_deposit_amount DECIMAL(15,2),
    min_deposit_amount DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    CONSTRAINT valid_deposit_limits CHECK (
        min_deposit_amount IS NULL OR
        max_deposit_amount IS NULL OR
        min_deposit_amount <= max_deposit_amount
    )
);

CREATE INDEX idx_savings_products_is_active ON savings_products(is_active);
CREATE INDEX idx_savings_products_name ON savings_products(name);
