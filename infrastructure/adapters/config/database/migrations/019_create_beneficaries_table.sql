CREATE TABLE IF NOT EXISTS beneficiaries (
    beneficiary_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    iban VARCHAR(34) NOT NULL,
    beneficiary_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    country VARCHAR(100),
    street VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    address_country VARCHAR(100),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_beneficiaries_user
        FOREIGN KEY (user_id)
        REFERENCES bank_users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_beneficiaries_user_id ON beneficiaries(user_id);
CREATE INDEX idx_beneficiaries_iban ON beneficiaries(iban);
CREATE INDEX idx_beneficiaries_is_verified ON beneficiaries(is_verified);
