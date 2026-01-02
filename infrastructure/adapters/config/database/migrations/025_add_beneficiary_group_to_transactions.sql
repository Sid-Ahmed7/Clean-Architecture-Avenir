ALTER TABLE transactions
ADD COLUMN beneficiary_id VARCHAR(255),
ADD COLUMN group_id VARCHAR(255);

ALTER TABLE transactions
ADD CONSTRAINT fk_transactions_beneficiary
FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(beneficiary_id) ON DELETE SET NULL,
ADD CONSTRAINT fk_transactions_group
FOREIGN KEY (group_id) REFERENCES beneficiary_groups(group_id) ON DELETE SET NULL;

CREATE INDEX idx_transactions_beneficiary_id ON transactions(beneficiary_id);
CREATE INDEX idx_transactions_group_id ON transactions(group_id);
