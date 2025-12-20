import { BeneficiaryGroupNotFoundError } from "../../../errors/BeneficiaryGroupNotFoundError";
import { BeneficiaryGroupRepositoryInterface } from "../../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";

export class DeleteBeneficiaryGroupUseCase {
  constructor(private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface) {}

  async execute(groupId: string): Promise<void | BeneficiaryGroupNotFoundError | Error> {
    return this.beneficiaryGroupRepository.delete(groupId);
  }
}