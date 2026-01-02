CREATE TYPE user_status_enum AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE', 'BANNED');

CREATE TABLE IF NOT EXISTS bank_users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status user_status_enum DEFAULT 'PENDING' NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    is_registered BOOLEAN DEFAULT false NOT NULL,
    confirmation_token VARCHAR(500),
    confirmation_token_expires_at TIMESTAMP,
    reset_password_token VARCHAR(500),
    reset_token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_email ON bank_users(email);
CREATE INDEX idx_users_confirmation_token ON bank_users(confirmation_token);