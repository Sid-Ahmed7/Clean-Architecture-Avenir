CREATE TYPE order_type_enum AS ENUM ('BUY', 'SELL');

CREATE TABLE IF NOT EXISTS stock_orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    stock_symbol VARCHAR(10) NOT NULL,
    quantity BIGINT NOT NULL CHECK (quantity > 0),
    order_price DECIMAL(15,4) NOT NULL CHECK (order_price > 0),
    fee DECIMAL(15,2) DEFAULT 0.00 CHECK (fee >= 0),
    order_type order_type_enum NOT NULL,
    order_status order_status_enum DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    executed_at TIMESTAMP,
    remaining_quantity BIGINT NOT NULL CHECK (remaining_quantity >= 0),
    fees_paid BOOLEAN DEFAULT false NOT NULL,

    FOREIGN KEY (user_id) REFERENCES bank_users(id) ON DELETE CASCADE,
    FOREIGN KEY (stock_symbol) REFERENCES stocks(symbol) ON DELETE RESTRICT,
    CONSTRAINT valid_remaining_quantity CHECK (remaining_quantity <= quantity)
);

CREATE INDEX idx_stock_orders_user_id ON stock_orders(user_id);
CREATE INDEX idx_stock_orders_stock_symbol ON stock_orders(stock_symbol);
CREATE INDEX idx_stock_orders_order_status ON stock_orders(order_status);
CREATE INDEX idx_stock_orders_order_type ON stock_orders(order_type);
CREATE INDEX idx_stock_orders_created_at ON stock_orders(created_at DESC);
CREATE INDEX idx_stock_orders_active ON stock_orders(stock_symbol, order_status)
    WHERE order_status IN ('PENDING', 'PARTIALLY_EXECUTED');

