import { BeneficiaryGroupEntity } from "../../../../domain/entities/BeneficiaryGroupEntity";
import { BeneficiaryGroupAlreadyExistsError } from "../../../errors/BeneficiaryGroupAlreadyExistsError";
import { BeneficiaryGroupRepositoryInterface } from "../../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";
import { UuidGeneratorService } from "../../../ports/services/UuidGeneratorService";
import { CreateBeneficiaryGroup } from "../../../requests/CreateBeneficiaryGroup";

export class CreateBeneficiaryGroupUseCase {
  public constructor(private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface, private readonly uuidService: UuidGeneratorService){}

  public async execute(data: CreateBeneficiaryGroup): Promise<BeneficiaryGroupEntity | BeneficiaryGroupAlreadyExistsError | Error> {
    const groupId = this.uuidService.generate();

    const group = BeneficiaryGroupEntity.from(groupId, data.userId, data.groupName, data.beneficiaryIds);

    if(group instanceof Error) {
        return group;
    }

    const createBeneficiaryGroup = await this.beneficiaryGroupRepository.create(group);

    if(createBeneficiaryGroup instanceof Error) {
        return createBeneficiaryGroup;
    }

    return createBeneficiaryGroup;
  }

}