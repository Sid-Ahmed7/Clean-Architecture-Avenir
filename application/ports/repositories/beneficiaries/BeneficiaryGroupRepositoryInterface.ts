import { BeneficiaryGroupEntity } from "../../../../domain/entities/BeneficiaryGroupEntity";
import { BeneficiaryGroupAlreadyExistsError } from "../../../errors/BeneficiaryGroupAlreadyExistsError";
import { BeneficiaryGroupNotFoundError } from "../../../errors/BeneficiaryGroupNotFoundError";

export interface BeneficiaryGroupRepositoryInterface {
  create(group: BeneficiaryGroupEntity): Promise<BeneficiaryGroupEntity | BeneficiaryGroupAlreadyExistsError>;
  getById(groupId: string): Promise<BeneficiaryGroupEntity | BeneficiaryGroupNotFoundError>;
  getAllByUserId(userId: string): Promise<BeneficiaryGroupEntity[]>;
  update(group: BeneficiaryGroupEntity): Promise<BeneficiaryGroupEntity | BeneficiaryGroupNotFoundError>;
  delete(groupId: string): Promise<void | BeneficiaryGroupNotFoundError>;
}