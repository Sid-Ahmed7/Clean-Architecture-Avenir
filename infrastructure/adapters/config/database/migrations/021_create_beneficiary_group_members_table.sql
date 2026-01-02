CREATE TABLE IF NOT EXISTS beneficiary_group_members (
    group_id VARCHAR(255) NOT NULL,
    beneficiary_id VARCHAR(255) NOT NULL,

    CONSTRAINT pk_beneficiary_group_members
        PRIMARY KEY (group_id, beneficiary_id),

    CONSTRAINT fk_group_members_group
        FOREIGN KEY (group_id)
        REFERENCES beneficiary_groups(group_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_group_members_beneficiary
        FOREIGN KEY (beneficiary_id)
        REFERENCES beneficiaries(beneficiary_id)
        ON DELETE CASCADE
);

CREATE INDEX idx_beneficiary_group_members_group_id
    ON beneficiary_group_members(group_id);

CREATE INDEX idx_beneficiary_group_members_beneficiary_id
    ON beneficiary_group_members(beneficiary_id);
