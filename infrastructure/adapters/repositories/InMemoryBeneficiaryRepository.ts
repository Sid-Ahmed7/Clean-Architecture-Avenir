import { BeneficiaryAlreadyExistsError } from "../../../application/errors/BeneficiaryAlreadyExistsError";
import { BeneficiaryNotFoundError } from "../../../application/errors/BeneficiaryNotFoundError";
import { BeneficiaryRepositoryInterface } from "../../../application/ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { BeneficiaryEntity } from "../../../domain/entities/BeneficiaryEntity";

export class InMemoryBeneficiaryRepository implements BeneficiaryRepositoryInterface {
  private beneficiaries: Array<BeneficiaryEntity>;

  public constructor(){
    this.beneficiaries = [];
  }

  public async create(beneficiary: BeneficiaryEntity): Promise<BeneficiaryEntity | BeneficiaryAlreadyExistsError> {
    const existing = this.beneficiaries.find(b => b.beneficiaryId === beneficiary.beneficiaryId);
    if (existing) {
      return new BeneficiaryAlreadyExistsError(`Beneficiary with ID ${beneficiary.beneficiaryId} already exists`);
    }
    this.beneficiaries.push(beneficiary);
    return beneficiary;
  }

  public async getById(beneficiaryId: string): Promise<BeneficiaryEntity | BeneficiaryNotFoundError> {
    const beneficiary = this.beneficiaries.find(b => b.beneficiaryId === beneficiaryId);
    if (!beneficiary) {
      return new BeneficiaryNotFoundError(`Beneficiary with ID ${beneficiaryId} not found`);
    }
    return beneficiary;
  }

  public async getByIban(iban: string, userId: string): Promise<BeneficiaryEntity | BeneficiaryNotFoundError> {
    const beneficiary = this.beneficiaries.find(b => b.iban === iban && b.userId === userId);
    if (!beneficiary) {
      return new BeneficiaryNotFoundError(`Beneficiary with IBAN ${iban} not found for user ${userId}`);
    }
    return beneficiary;
  }

  public async getAllByUserId(userId: string): Promise<BeneficiaryEntity[]> {
    return this.beneficiaries.filter(b => b.userId === userId);
  }

  public async update(beneficiary: BeneficiaryEntity): Promise<BeneficiaryEntity | BeneficiaryNotFoundError> {
    const index = this.beneficiaries.findIndex(b => b.beneficiaryId === beneficiary.beneficiaryId);
    if (index === -1) {
      return new BeneficiaryNotFoundError(`Beneficiary with ID ${beneficiary.beneficiaryId} not found`);
    }
    this.beneficiaries[index] = beneficiary;
    return beneficiary;
  }

  public async delete(beneficiaryId: string): Promise<void | BeneficiaryNotFoundError> {
    const index = this.beneficiaries.findIndex(b => b.beneficiaryId === beneficiaryId);
    if (index === -1) {
      return new BeneficiaryNotFoundError(`Beneficiary with ID ${beneficiaryId} not found`);
    }

    this.beneficiaries.splice(index, 1);
  }
}