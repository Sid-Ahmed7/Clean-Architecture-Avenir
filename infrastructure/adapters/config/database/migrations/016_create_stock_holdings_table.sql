CREATE TABLE IF NOT EXISTS stock_holdings (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    stock_symbol VARCHAR(10) NOT NULL,
    quantity BIGINT NOT NULL CHECK (quantity >= 0),
    block_quantity BIGINT DEFAULT 0 NOT NULL CHECK (block_quantity >= 0),
    average_purchase_price DECIMAL(15,2) NOT NULL CHECK (average_purchase_price >= 0),
    total_invested DECIMAL(15,2) NOT NULL CHECK (total_invested >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES bank_users(id) ON DELETE CASCADE,
    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol) ON DELETE RESTRICT,
    CONSTRAINT valid_block_quantity CHECK (block_quantity <= quantity),
    CONSTRAINT unique_user_stock UNIQUE (user_id, stock_symbol)
);

CREATE INDEX idx_stock_holdings_user_id ON stock_holdings(user_id);
CREATE INDEX idx_stock_holdings_stock_symbol ON stock_holdings(stock_symbol);
CREATE INDEX idx_stock_holdings_user_stock ON stock_holdings(user_id, stock_symbol);
CREATE INDEX idx_stock_holdings_quantity ON stock_holdings(quantity) WHERE quantity > 0;
