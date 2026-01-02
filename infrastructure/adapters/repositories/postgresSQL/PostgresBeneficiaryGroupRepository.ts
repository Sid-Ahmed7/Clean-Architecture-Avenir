
import { BeneficiaryGroupAlreadyExistsError } from "../../../../application/errors/BeneficiaryGroupAlreadyExistsError";
import { BeneficiaryGroupNotFoundError } from "../../../../application/errors/BeneficiaryGroupNotFoundError";
import {BeneficiaryGroupRepositoryInterface} from "../../../../application/ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";
import { BeneficiaryGroupEntity } from "../../../../domain/entities/BeneficiaryGroupEntity";
import { pgPool } from "../../config/database/configPostgresSQL";
import { PostgresBeneficiaryGroupRow } from "./types/PostgresBeneficiaryGroupRow";

export class PostgresBeneficiaryGroupRepository implements BeneficiaryGroupRepositoryInterface {

  public async create(beneficiaryGroup: BeneficiaryGroupEntity): Promise<BeneficiaryGroupEntity | BeneficiaryGroupAlreadyExistsError> {
    const existingGroup = await this.getById(beneficiaryGroup.groupId);
    if (!(existingGroup instanceof BeneficiaryGroupNotFoundError)) {
      return new BeneficiaryGroupAlreadyExistsError(`Beneficiaries group with ID ${beneficiaryGroup.groupId} already exists`);
    }

    const result = await pgPool.query<PostgresBeneficiaryGroupRow>(
      `INSERT INTO beneficiary_groups (
        group_id, user_id, group_name, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        beneficiaryGroup.groupId,
        beneficiaryGroup.userId,
        beneficiaryGroup.groupName,
        beneficiaryGroup.createdAt,
        beneficiaryGroup.updatedAt
      ]
    );

    const row = result.rows[0];
    if (!row) {
      return new BeneficiaryGroupAlreadyExistsError(`Failed to create beneficiary group`);
    }
    if (beneficiaryGroup.beneficiaryIds.length > 0) {
      for (const beneficiaryId of beneficiaryGroup.beneficiaryIds) {
        await pgPool.query(
          `INSERT INTO beneficiary_group_members (group_id, beneficiary_id) VALUES ($1, $2)`,
          [beneficiaryGroup.groupId, beneficiaryId]
        );
      }
    }

    return this.mapRowToEntity(row, beneficiaryGroup.beneficiaryIds);
  }

  public async getById(groupId: string): Promise<BeneficiaryGroupEntity | BeneficiaryGroupNotFoundError> {
    const result = await pgPool.query<PostgresBeneficiaryGroupRow>(
      'SELECT * FROM beneficiary_groups WHERE group_id = $1',
      [groupId]
    );

    if (result.rows.length === 0) {
      return new BeneficiaryGroupNotFoundError(`Beneficiaries group with ID ${groupId} not found`);
    }

    const row = result.rows[0];
    if (!row) {
      return new BeneficiaryGroupNotFoundError(`Beneficiaries group with ID ${groupId} not found`);
    }

    const membersResult = await pgPool.query<{ beneficiary_id: string }>(
      'SELECT beneficiary_id FROM beneficiary_group_members WHERE group_id = $1',
      [groupId]
    );

    const beneficiaryIds = membersResult.rows.map(m => m.beneficiary_id);

    return this.mapRowToEntity(row, beneficiaryIds);
  }

  public async getAllByUserId(userId: string): Promise<BeneficiaryGroupEntity[]> {
    const result = await pgPool.query<PostgresBeneficiaryGroupRow>(
      'SELECT * FROM beneficiary_groups WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const groups: BeneficiaryGroupEntity[] = [];

    for (const row of result.rows) {
      const membersResult = await pgPool.query<{ beneficiary_id: string }>(
        'SELECT beneficiary_id FROM beneficiary_group_members WHERE group_id = $1',
        [row.group_id]
      );

      const beneficiaryIds = membersResult.rows.map(m => m.beneficiary_id);
      const group = this.mapRowToEntity(row, beneficiaryIds);

      if (!(group instanceof Error)) {
        groups.push(group);
      }
    }

    return groups;
  }

  public async update(group: BeneficiaryGroupEntity): Promise<BeneficiaryGroupEntity | BeneficiaryGroupNotFoundError> {
    const result = await pgPool.query<PostgresBeneficiaryGroupRow>(
      `UPDATE beneficiary_groups SET
        group_name = $1,
        updated_at = $2
      WHERE group_id = $3
      RETURNING *`,
      [
        group.groupName,
        new Date(),
        group.groupId
      ]
    );

    if (result.rows.length === 0) {
      return new BeneficiaryGroupNotFoundError(`Beneficiaries group with ID ${group.groupId} not found`);
    }

    const row = result.rows[0];
    if (!row) {
      return new BeneficiaryGroupNotFoundError(`Beneficiaries group with ID ${group.groupId} not found`);
    }

    
    await pgPool.query(
      'DELETE FROM beneficiary_group_members WHERE group_id = $1',
      [group.groupId]
    );

    if (group.beneficiaryIds.length > 0) {
      for (const beneficiaryId of group.beneficiaryIds) {
        await pgPool.query(
          `INSERT INTO beneficiary_group_members (group_id, beneficiary_id) VALUES ($1, $2)`,
          [group.groupId, beneficiaryId]
        );
      }
    }

    return this.mapRowToEntity(row, group.beneficiaryIds);
  }

  public async delete(groupId: string): Promise<void | BeneficiaryGroupNotFoundError> {
    await pgPool.query(
      'DELETE FROM beneficiary_group_members WHERE group_id = $1',
      [groupId]
    );

    const result = await pgPool.query(
      'DELETE FROM beneficiary_groups WHERE group_id = $1',
      [groupId]
    );

    if (result.rowCount === 0) {
      return new BeneficiaryGroupNotFoundError(`Beneficiaries group with ID ${groupId} not found`);
    }
  }

  private mapRowToEntity(row: PostgresBeneficiaryGroupRow, beneficiaryIds: string[]): BeneficiaryGroupEntity | Error {
    return BeneficiaryGroupEntity.from(
      row.group_id,
      row.user_id,
      row.group_name,
      beneficiaryIds,
      row.created_at,
      row.updated_at
    );
  }
}