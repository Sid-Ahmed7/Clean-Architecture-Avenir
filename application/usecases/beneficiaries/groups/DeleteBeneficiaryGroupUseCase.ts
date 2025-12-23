import { BeneficiaryGroupNotFoundError } from "../../../errors/BeneficiaryGroupNotFoundError";
import { BeneficiaryGroupRepositoryInterface } from "../../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";
import { SendNotificationToClientUseCase } from "../../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../../domain/enums/NotificationTypeEnum";

export class DeleteBeneficiaryGroupUseCase {
  constructor(
    private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface,
    private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
  ) {}

  async execute(groupId: string, userId?: string): Promise<void | BeneficiaryGroupNotFoundError | Error> {
    const existingGroup = await this.beneficiaryGroupRepository.getById(groupId);

    if (existingGroup instanceof Error) {
        return existingGroup;
    }

    const groupName = existingGroup.groupName;
    const groupUserId = userId || existingGroup.userId;

    const result = await this.beneficiaryGroupRepository.delete(groupId);

    if (result instanceof Error) {
        return result;
    }

    if (this.sendNotificationUseCase) {
        await this.sendNotificationUseCase.execute(
            groupUserId,
            `Le groupe de bénéficiaires "${groupName}" a été supprimé.`,
            NotificationTypeEnum.INFO
        );
    }

    return result;
  }
}