import { BeneficiaryGroupEntity } from "../../../domain/entities/BeneficiaryGroupEntity";
import { BeneficiaryGroupRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";

export class GetBeneficiaryGroupsUseCase {
  public constructor(
    private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface,
  ) {}

  public async execute(userId: string): Promise<BeneficiaryGroupEntity[]> {
    return await this.beneficiaryGroupRepository.getAllByUserId(userId);
  }
}
