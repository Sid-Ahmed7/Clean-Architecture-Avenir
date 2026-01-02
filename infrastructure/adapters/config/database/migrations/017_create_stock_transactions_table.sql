CREATE TABLE IF NOT EXISTS stock_transactions (
    id VARCHAR(255) PRIMARY KEY,
    buy_order_id VARCHAR(255) NOT NULL,
    sell_order_id VARCHAR(255) NOT NULL,
    stock_symbol VARCHAR(10) NOT NULL,
    quantity BIGINT NOT NULL CHECK (quantity > 0),
    execution_price DECIMAL(15,4) NOT NULL CHECK (execution_price > 0),
    buyer_user_id VARCHAR(255) NOT NULL,
    seller_user_id VARCHAR(255) NOT NULL,
    buyer_fee DECIMAL(15,2) DEFAULT 0.00 CHECK (buyer_fee >= 0),
    seller_fee DECIMAL(15,2) DEFAULT 0.00 CHECK (seller_fee >= 0),
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    FOREIGN KEY (buy_order_id) REFERENCES stock_orders(id) ON DELETE RESTRICT,
    FOREIGN KEY (sell_order_id) REFERENCES stock_orders(id) ON DELETE RESTRICT,
    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol) ON DELETE RESTRICT,
    FOREIGN KEY (buyer_user_id) REFERENCES bank_users(id) ON DELETE RESTRICT,
    FOREIGN KEY (seller_user_id) REFERENCES bank_users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_stock_transactions_stock_symbol ON stock_transactions(stock_symbol);
CREATE INDEX idx_stock_transactions_buyer_user_id ON stock_transactions(buyer_user_id);
CREATE INDEX idx_stock_transactions_seller_user_id ON stock_transactions(seller_user_id);
CREATE INDEX idx_stock_transactions_buy_order_id ON stock_transactions(buy_order_id);
CREATE INDEX idx_stock_transactions_sell_order_id ON stock_transactions(sell_order_id);
CREATE INDEX idx_stock_transactions_executed_at ON stock_transactions(executed_at DESC);
CREATE INDEX idx_stock_transactions_user_symbol ON stock_transactions(buyer_user_id, stock_symbol);
CREATE INDEX idx_stock_transactions_seller_symbol ON stock_transactions(seller_user_id, stock_symbol);
