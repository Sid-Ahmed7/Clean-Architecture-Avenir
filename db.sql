CREATE TYPE permission_enum AS ENUM (
    'VIEW_ACCOUNT',
    'TRANSFER_FUNDS',
    'APPROVE_LOAN',
    'CREATE_ACCOUNT',
    'CLOSE_ACCOUNT',
    'MANAGE_USERS',
    'VIEW_TRANSACTIONS',
    'CREATE_STOCK_ORDER',
    'VIEW_LOANS',
    'MANAGE_NOTIFICATIONS',
    'READ_MESSAGES',
    'SEND_MESSAGES'
);

CREATE TYPE account_type_enum AS ENUM ('CHECKING','SAVINGS','INVESTMENT');
CREATE TYPE transaction_type_enum AS ENUM ('DEPOSIT','WITHDRAWAL','TRANSFER','LOAN_PAYMENT','INTEREST','FEE');
CREATE TYPE order_type_enum AS ENUM ('BUY','SELL');
CREATE TYPE order_status_enum AS ENUM ('PENDING','COMPLETED','CANCELLED','REJECTED');
CREATE TYPE loan_status_enum AS ENUM ('ACTIVE','CLOSED','DEFAULTED');
CREATE TYPE read_status_enum AS ENUM ('UNREAD','READ');
CREATE TYPE user_status_enum AS ENUM ('ACTIVE','BANNED','PENDING');
CREATE TYPE account_status_enum AS ENUM ('ACTIVE','CLOSED','FROZEN');
CREATE TYPE notification_type_enum AS ENUM ('INFO','WARNING','ALERT');
CREATE TYPE loan_type_enum AS ENUM ('PERSONAL','MORTGAGE','AUTO','BUSINESS');

CREATE TABLE bank_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(25),
    phone VARCHAR(20),
    date_of_birth DATE,
    address VARCHAR(255),
    is_registered BOOLEAN DEFAULT FALSE,
    status user_status_enum,
    reset_password_token VARCHAR(255),
    reset_token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    permission_name permission_enum UNIQUE NOT NULL
);

CREATE TABLE user_roles (
    user_uuid UUID REFERENCES bank_users(id),
    role_id INT REFERENCES roles(id),
    PRIMARY KEY (user_uuid, role_id)
);

CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id),
    permission_id INT REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_uuid UUID REFERENCES bank_users(id) NOT NULL,
    refresh_token TEXT NOT NULL,
    refresh_expiry_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    account_number BIGINT PRIMARY KEY,
    iban CHAR(34) UNIQUE NOT NULL,
    user_uuid UUID REFERENCES bank_users(id) NOT NULL,
    custom_account_name VARCHAR(255),
    current_balance NUMERIC(15,2) DEFAULT 0,
    account_type account_type_enum NOT NULL DEFAULT 'CHECKING',
    currency CHAR(3) DEFAULT 'EUR',
    daily_withdrawal_limit NUMERIC(15,2),
    daily_transfer_limit NUMERIC(15,2),
    overdraft_limit NUMERIC(15,2),
    created_by UUID REFERENCES bank_users(id),
    account_status account_status_enum DEFAULT 'PENDING',
    closed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    debit_account BIGINT REFERENCES accounts(account_number),
    credit_account BIGINT REFERENCES accounts(account_number),
    amount NUMERIC(15,2) NOT NULL,
    transaction_type transaction_type_enum NOT NULL,
    description TEXT,
    transaction_reference VARCHAR(50) UNIQUE,
    status order_status_enum DEFAULT 'PEN',
    category VARCHAR(50),
    executed_by UUID REFERENCES bank_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE savings_accounts (
    account_number BIGINT PRIMARY KEY REFERENCES accounts(account_number),
    interest_rate NUMERIC(5,2) NOT NULL,
    last_interest_applied DATE DEFAULT CURRENT_DATE,
    interest_history JSONB,
    maturity_date DATE
);

CREATE TABLE stocks (
    symbol VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    curency
    is_action_available BOOLEAN DEFAULT TRUE
);

CREATE TABLE stock_orders (
    id SERIAL PRIMARY KEY,
    user_uuid UUID REFERENCES bank_users(id),
    stock_symbol VARCHAR(10) REFERENCES stocks(symbol),
    order_type order_type_enum NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    executed_price NUMERIC(10,2),
    fee NUMERIC(5,2) DEFAULT 1,
    status order_status_enum DEFAULT 'PENDING',
    executed_at TIMESTAMP,
    order_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loans (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_uuid UUID REFERENCES bank_users(id),
    amount NUMERIC(15,2) NOT NULL,
    annual_rate NUMERIC(5,2) NOT NULL,
    monthly_payment NUMERIC(15,2) NOT NULL,
    insurance NUMERIC(15,2) NOT NULL,
    remaining_principal NUMERIC(15,2) NOT NULL,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    status loan_status_enum DEFAULT 'ACTIVE',
    loan_type loan_type_enum DEFAULT 'PERSONAL',
    created_by UUID REFERENCES bank_users(id),
    payment_history JSONB,
    default_date TIMESTAMP
);

CREATE TABLE discussions (
    client_uuid UUID REFERENCES bank_users(id) NOT NULL,
    advisor_uuid UUID REFERENCES bank_users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (client_uuid, advisor_uuid)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    discussion_client_uuid UUID NOT NULL REFERENCES discussions(client_uuid),
    discussion_advisor_uuid UUID NOT NULL REFERENCES discussions(advisor_uuid),
    author_uuid UUID REFERENCES bank_users(id) NOT NULL,
    content TEXT NOT NULL,
    read read_status_enum DEFAULT 'UNREAD',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_uuid UUID REFERENCES bank_users(id),
    message TEXT NOT NULL,
    read read_status_enum DEFAULT 'UNREAD',
    notification_type notification_type_enum DEFAULT 'INFO',
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_events (
    id SERIAL PRIMARY KEY,
    entity_name VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    user_uuid UUID REFERENCES bank_users(id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB NOT NULL,
    user_agent VARCHAR(255),
    previous_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
