import { BeneficiaryGroupEntity } from "../../../../domain/entities/BeneficiaryGroupEntity";
import { BeneficiaryGroupNotFoundError } from "../../../errors/BeneficiaryGroupNotFoundError";
import { BeneficiaryGroupRepositoryInterface } from "../../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";
import { UpdateBeneficiaryGroup } from "../../../requests/UpdateBeneficiaryGroup";
import { SendNotificationToClientUseCase } from "../../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../../domain/enums/NotificationTypeEnum";

export class UpdateBeneficiaryGroupUseCase {
  constructor(
    private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface,
    private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
  ) {}

  public async execute(data: UpdateBeneficiaryGroup): Promise<BeneficiaryGroupEntity | BeneficiaryGroupNotFoundError | Error> {
    const existingGroup = await this.beneficiaryGroupRepository.getById(data.groupId);

    if (existingGroup instanceof Error) {
      return existingGroup;
    }

    if (existingGroup.userId !== data.userId) {
      return new BeneficiaryGroupNotFoundError(`Beneficiary group ${data.groupId} not found for user ${data.userId}`);
    }

    if (data.groupName !== undefined) {
      existingGroup.updateGroupName(data.groupName);
    }

    if (data.beneficiaryIds !== undefined) {
      existingGroup.beneficiaryIds = data.beneficiaryIds;
      existingGroup.updatedAt = new Date();
    }

    const updatedGroup = await this.beneficiaryGroupRepository.update(existingGroup);

    if (updatedGroup instanceof Error) {
      return updatedGroup;
    }

    if (this.sendNotificationUseCase) {
        await this.sendNotificationUseCase.execute(
            data.userId,
            `Le groupe de bénéficiaires "${existingGroup.groupName}" a été mis à jour.`,
            NotificationTypeEnum.INFO
        );
    }

    return updatedGroup;
  }
}
