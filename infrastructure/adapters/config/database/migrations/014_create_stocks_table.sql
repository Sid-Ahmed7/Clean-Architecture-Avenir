
CREATE TYPE ipo_type_enum AS ENUM ('INITIAL', 'SECONDARY');


CREATE TABLE IF NOT EXISTS stocks (
    id VARCHAR(255) PRIMARY KEY,
    symbol VARCHAR(10) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    current_price DECIMAL(15,4) NOT NULL CHECK (current_price >= 0),
    rate_of_change DECIMAL(10,4) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_action_available BOOLEAN DEFAULT true NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total_shares BIGINT NOT NULL CHECK (total_shares > 0),
    previous_price DECIMAL(15,4),
    ipo_active BOOLEAN DEFAULT false NOT NULL,
    available_shares_for_ipo BIGINT DEFAULT 0 NOT NULL,
    ipo_type ipo_type_enum
);


CREATE INDEX idx_stocks_symbol ON stocks(symbol);
CREATE INDEX idx_stocks_is_action_available ON stocks(is_action_available);
CREATE INDEX idx_stocks_ipo_active ON stocks(ipo_active);
CREATE INDEX idx_stocks_company_name ON stocks(company_name);
