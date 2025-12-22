import { BeneficiaryGroupEntity } from "../../../../domain/entities/BeneficiaryGroupEntity";
import { BeneficiaryGroupRepositoryInterface } from "../../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";

export class GetGroupsByUserUseCase {
  constructor(private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface) {}

  async execute(userId: string): Promise<BeneficiaryGroupEntity[]> {
    return this.beneficiaryGroupRepository.getAllByUserId(userId);
  }
}