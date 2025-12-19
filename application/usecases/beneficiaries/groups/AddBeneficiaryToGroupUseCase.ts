import { BeneficiaryGroupEntity } from "../../../../domain/entities/BeneficiaryGroupEntity";
import { BeneficiaryGroupNotFoundError } from "../../../errors/BeneficiaryGroupNotFoundError";
import { BeneficiaryNotFoundError } from "../../../errors/BeneficiaryNotFoundError";
import { BeneficiaryGroupRepositoryInterface } from "../../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";
import { BeneficiaryRepositoryInterface } from "../../../ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";

export class AddBeneficiaryToGroupUseCase {
  constructor(
    private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface,
    private readonly beneficiaryRepository: BeneficiaryRepositoryInterface
  ) {}

  public async excute(groupId: string, beneficiaryId: string ): Promise<BeneficiaryGroupEntity | BeneficiaryGroupNotFoundError | BeneficiaryNotFoundError> {
    
    const beneficiary = await this.beneficiaryRepository.getById(beneficiaryId);
    if(beneficiary instanceof Error) {
        return beneficiary;
    }

    const group = await this.beneficiaryGroupRepository.getById(groupId);
    if(group instanceof Error) {
        return group;
    }

    group.addBeneficiary(beneficiary.beneficiaryId);
    const updatedBeneficiary = await this.beneficiaryGroupRepository.update(group);

    if(updatedBeneficiary instanceof Error) {
        return updatedBeneficiary;
    }

    return updatedBeneficiary;
}





  
}