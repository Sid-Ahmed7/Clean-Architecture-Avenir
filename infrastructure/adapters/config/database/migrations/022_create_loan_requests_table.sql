
CREATE TYPE loan_status_enum AS ENUM (
    'PENDING',
    'ADVISOR_APPROVED',
    'ADVISOR_REJECTED',
    'DIRECTOR_APPROVED',
    'DIRECTOR_REJECTED',
    'RATE_PROPOSED',
    'CLIENT_REJECTED',
    'DISBURSED',
    'PAID_OFF'
);

CREATE TABLE IF NOT EXISTS loan_requests (
    id VARCHAR(255) PRIMARY KEY,

    client_id VARCHAR(255) NOT NULL,
    advisor_id VARCHAR(255) NOT NULL,

    amount DECIMAL(15,2) NOT NULL,
    purpose TEXT NOT NULL,
    status loan_status_enum NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    proposed_rate DECIMAL(5,2),
    applied_rate DECIMAL(5,2),
    monthly_payment DECIMAL(15,2),
    client_decision VARCHAR(20),

    duration_months INTEGER NOT NULL DEFAULT 12,
    advisor_name VARCHAR(255),
    director_name VARCHAR(255),
    client_name VARCHAR(255),

    CONSTRAINT fk_loan_requests_client
        FOREIGN KEY (client_id)
        REFERENCES bank_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_loan_requests_advisor
        FOREIGN KEY (advisor_id)
        REFERENCES bank_users(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_loan_requests_client_id
    ON loan_requests(client_id);

CREATE INDEX idx_loan_requests_advisor_id
    ON loan_requests(advisor_id);

CREATE INDEX idx_loan_requests_status
    ON loan_requests(status);
