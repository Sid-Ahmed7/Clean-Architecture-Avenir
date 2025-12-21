import { BeneficiaryGroupEntity } from "../../../../domain/entities/BeneficiaryGroupEntity";
import { BeneficiaryGroupAlreadyExistsError } from "../../../errors/BeneficiaryGroupAlreadyExistsError";
import { BeneficiaryGroupRepositoryInterface } from "../../../ports/repositories/beneficiaries/BeneficiaryGroupRepositoryInterface";
import { UuidGeneratorService } from "../../../ports/services/UuidGeneratorService";
import { CreateBeneficiaryGroup } from "../../../requests/CreateBeneficiaryGroup";
import { SendNotificationToClientUseCase } from "../../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../../domain/enums/NotificationTypeEnum";

export class CreateBeneficiaryGroupUseCase {
  public constructor(
    private readonly beneficiaryGroupRepository: BeneficiaryGroupRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
    private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
  ){}

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

    if (this.sendNotificationUseCase) {
        await this.sendNotificationUseCase.execute(
            data.userId,
            `Le groupe de bénéficiaires "${data.groupName}" a été créé avec succès.`,
            NotificationTypeEnum.INFO
        );
    }

    return createBeneficiaryGroup;
  }

}