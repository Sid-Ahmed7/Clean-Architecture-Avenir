import { BeneficiaryAlreadyExistsError } from "../../../../application/errors/BeneficiaryAlreadyExistsError";
import { BeneficiaryNotFoundError } from "../../../../application/errors/BeneficiaryNotFoundError";
import {BeneficiaryRepositoryInterface} from "../../../../application/ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { BeneficiaryEntity } from "../../../../domain/entities/BeneficiaryEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresBeneficiaryRow } from "./types/PostgresBeneficiaryRow";

export class PostgresBeneficiaryRepository implements BeneficiaryRepositoryInterface {

  public async create(beneficiary: BeneficiaryEntity): Promise<BeneficiaryEntity | BeneficiaryAlreadyExistsError> {
    const existingBeneficiary = await this.getById(beneficiary.beneficiaryId);
    if (!(existingBeneficiary instanceof BeneficiaryNotFoundError)) {
      return new BeneficiaryAlreadyExistsError(`Beneficiary with ID ${beneficiary.beneficiaryId} already exists`);
    }

    const result = await pgPool.query<PostgresBeneficiaryRow>(
      `INSERT INTO beneficiaries (
        beneficiary_id, user_id, iban, beneficiary_name, email, country,
        street, city, postal_code, address_country, is_verified, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        beneficiary.beneficiaryId,
        beneficiary.userId,
        beneficiary.iban,
        beneficiary.beneficiaryName,
        beneficiary.email || null,
        beneficiary.country || null,
        beneficiary.address?.street || null,
        beneficiary.address?.city || null,
        beneficiary.address?.postalCode || null,
        beneficiary.address?.country || null,
        beneficiary.isVerified,
        beneficiary.createdAt,
        beneficiary.updatedAt
      ]
    );

    const row = result.rows[0];
    if (!row) {
      return new BeneficiaryAlreadyExistsError(`Failed to create beneficiary`);
    }

    return this.mapRowToEntity(row);
  }

  public async getById(beneficiaryId: string): Promise<BeneficiaryEntity | BeneficiaryNotFoundError> {
    const result = await pgPool.query<PostgresBeneficiaryRow>(
      'SELECT * FROM beneficiaries WHERE beneficiary_id = $1',
      [beneficiaryId]
    );

    if (result.rows.length === 0) {
      return new BeneficiaryNotFoundError(`Beneficiary with ID ${beneficiaryId} not found`);
    }

    const row = result.rows[0];
    if (!row) {
      return new BeneficiaryNotFoundError(`Beneficiary with ID ${beneficiaryId} not found`);
    }

    return this.mapRowToEntity(row);
  }

  public async getByIban(iban: string, userId: string): Promise<BeneficiaryEntity | BeneficiaryNotFoundError> {
    const result = await pgPool.query<PostgresBeneficiaryRow>(
      'SELECT * FROM beneficiaries WHERE iban = $1 AND user_id = $2',
      [iban, userId]
    );

    if (result.rows.length === 0) {
      return new BeneficiaryNotFoundError(`Beneficiary with IBAN ${iban} not found for user ${userId}`);
    }

    const row = result.rows[0];
    if (!row) {
      return new BeneficiaryNotFoundError(`Beneficiary with IBAN ${iban} not found for user ${userId}`);
    }

    return this.mapRowToEntity(row);
  }

  public async getAllByUserId(userId: string): Promise<BeneficiaryEntity[]> {
    const result = await pgPool.query<PostgresBeneficiaryRow>(
      'SELECT * FROM beneficiaries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    return result.rows
      .map(row => this.mapRowToEntity(row))
      .filter((beneficiary): beneficiary is BeneficiaryEntity => !(beneficiary instanceof Error));
  }

  public async update(beneficiary: BeneficiaryEntity): Promise<BeneficiaryEntity | BeneficiaryNotFoundError> {
    const result = await pgPool.query<PostgresBeneficiaryRow>(
      `UPDATE beneficiaries SET
        iban = $1,
        beneficiary_name = $2,
        email = $3,
        country = $4,
        street = $5,
        city = $6,
        postal_code = $7,
        address_country = $8,
        is_verified = $9,
        updated_at = $10
      WHERE beneficiary_id = $11
      RETURNING *`,
      [
        beneficiary.iban,
        beneficiary.beneficiaryName,
        beneficiary.email || null,
        beneficiary.country || null,
        beneficiary.address?.street || null,
        beneficiary.address?.city || null,
        beneficiary.address?.postalCode || null,
        beneficiary.address?.country || null,
        beneficiary.isVerified,
        new Date(),
        beneficiary.beneficiaryId
      ]
    );

    if (result.rows.length === 0) {
      return new BeneficiaryNotFoundError(`Beneficiary with ID ${beneficiary.beneficiaryId} not found`);
    }

    const row = result.rows[0];
    if (!row) {
      return new BeneficiaryNotFoundError(`Beneficiary with ID ${beneficiary.beneficiaryId} not found`);
    }

    return this.mapRowToEntity(row);
  }

  public async delete(beneficiaryId: string): Promise<void | BeneficiaryNotFoundError> {
    const result = await pgPool.query(
      'DELETE FROM beneficiaries WHERE beneficiary_id = $1',
      [beneficiaryId]
    );

    if (result.rowCount === 0) {
      return new BeneficiaryNotFoundError(`Beneficiary with ID ${beneficiaryId} not found`);
    }
  }

  private mapRowToEntity(row: PostgresBeneficiaryRow): BeneficiaryEntity | Error {
    const address = row.street && row.city && row.postal_code && row.address_country
      ? {
          street: row.street,
          city: row.city,
          postalCode: row.postal_code,
          country: row.address_country
        }
      : undefined;

    return BeneficiaryEntity.from(
      row.beneficiary_id,
      row.user_id,
      row.iban,
      row.beneficiary_name,
      row.email || undefined,
      row.country || undefined,
      address,
      row.is_verified,
      row.created_at,
      row.updated_at
    );
  }
}