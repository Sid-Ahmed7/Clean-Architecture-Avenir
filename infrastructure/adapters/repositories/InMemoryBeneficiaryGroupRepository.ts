import { BeneficiaryGroupAlreadyExistsError } from "../../../application/errors/BeneficiaryGroupAlreadyExistsError";
import { BeneficiaryGroupNotFoundError } from "../../../application/errors/BeneficiaryGroupNotFoundError";
import { BeneficiaryGroupRepositoryInterface } from "../../../application/ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";
import { BeneficiaryGroupEntity } from "../../../domain/entities/BeneficiaryGroupEntity";

export class InMemoryBeneficiaryGroupRepository implements BeneficiaryGroupRepositoryInterface {
  private groupBeneficiaries: BeneficiaryGroupEntity[] = [];

  public constructor() {
    this.groupBeneficiaries = [];
  }

 public async create(beneficiaries: BeneficiaryGroupEntity): Promise<BeneficiaryGroupEntity | BeneficiaryGroupAlreadyExistsError> {
     const existing = this.groupBeneficiaries.find(b => b.groupId === beneficiaries.groupId);
     if (existing) {
       return new BeneficiaryGroupAlreadyExistsError(`Beneficiaries group with ID ${beneficiaries.groupId} already exists`);
     }
     this.groupBeneficiaries.push(beneficiaries);
     return beneficiaries;
   }
 
   public async getById(groupId: string): Promise<BeneficiaryGroupEntity | BeneficiaryGroupNotFoundError> {
     const group = this.groupBeneficiaries.find(b => b.groupId === groupId);
     if (!group) {
       return new BeneficiaryGroupNotFoundError(`Beneficiaries group with ID ${groupId} not found`);
     }
     return group;
   }
  
   public async getAllByUserId(userId: string): Promise<BeneficiaryGroupEntity[]> {
     return this.groupBeneficiaries.filter(b => b.userId === userId);
   }
 
   public async update(group: BeneficiaryGroupEntity): Promise<BeneficiaryGroupEntity | BeneficiaryGroupNotFoundError> {
     const index = this.groupBeneficiaries.findIndex(b => b.groupId === group.groupId);
     if (index === -1) {
       return new BeneficiaryGroupNotFoundError(`Beneficiaries group with ID ${group.groupId} not found`);
     }
     this.groupBeneficiaries[index] = group;
     return group;
   }
 
   public async delete(groupId: string): Promise<void | BeneficiaryGroupNotFoundError> {
     const index = this.groupBeneficiaries.findIndex(b => b.groupId === groupId);
     if (index === -1) {
       return new BeneficiaryGroupNotFoundError(`Beneficiaries group with ID ${groupId} not found`);
     }
 
     this.groupBeneficiaries.splice(index, 1);
   }
 }