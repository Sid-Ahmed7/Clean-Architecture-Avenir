import { BeneficiaryGroupEntity } from "../../../../domain/entities/BeneficiaryGroupEntity";
import { BeneficiaryGroupNotFoundError } from "../../../errors/BeneficiaryGroupNotFoundError";
import { BeneficiaryGroupRepositoryInterface } from "../../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";

export class RemoveBeneficiaryFromGroupUseCase {
  public constructor(private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface) {}

  public async execute(groupId: string, beneficiaryId: string): Promise<BeneficiaryGroupEntity | BeneficiaryGroupNotFoundError | Error> {

    const group = await this.beneficiaryGroupRepository.getById(groupId);
    if(group instanceof Error) {
        return group;
    }

    group.removeBeneficiary(beneficiaryId);

    const updatedBeneficiary = await this.beneficiaryGroupRepository.update(group);

    if(updatedBeneficiary instanceof Error) {
        return updatedBeneficiary;
    }

    return updatedBeneficiary;

  }
}