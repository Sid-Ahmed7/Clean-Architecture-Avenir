CREATE TYPE repayment_status_enum AS ENUM (
    'PAYING',
    'FAILED',
    'PAID_OFF'
);

CREATE TABLE IF NOT EXISTS loan_repayments (
    id VARCHAR(255) PRIMARY KEY,

    loan_request_id VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL,

    monthly_amount DECIMAL(15,2) NOT NULL,
    remaining_principal DECIMAL(15,2) NOT NULL,

    next_due_date DATE NOT NULL,
    duration_months INTEGER NOT NULL,

    payments_made INTEGER NOT NULL DEFAULT 0,
    status repayment_status_enum NOT NULL DEFAULT 'PAYING',
    last_failure_reason TEXT,

    CONSTRAINT fk_loan_repayments_loan_request
        FOREIGN KEY (loan_request_id)
        REFERENCES loan_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_loan_repayments_client
        FOREIGN KEY (client_id)
        REFERENCES bank_users(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_loan_repayments_client_id
    ON loan_repayments(client_id);

CREATE INDEX idx_loan_repayments_loan_request_id
    ON loan_repayments(loan_request_id);

CREATE INDEX idx_loan_repayments_next_due_date
    ON loan_repayments(next_due_date);

CREATE INDEX idx_loan_repayments_status
    ON loan_repayments(status);
