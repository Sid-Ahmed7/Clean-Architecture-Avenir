import { BeneficiaryRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { BeneficiaryNotFoundError } from "../../errors/BeneficiaryNotFoundError";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class DeleteBeneficiaryUseCase {
    public constructor(
        private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ) {}

    public async execute(beneficiaryId: string, userId: string): Promise<void | BeneficiaryNotFoundError | Error> {
        const existingBeneficiary = await this.beneficiaryRepository.getById(beneficiaryId);

        if (existingBeneficiary instanceof BeneficiaryNotFoundError) {
            return existingBeneficiary;
        }

        if (existingBeneficiary.userId !== userId) {
            return new BeneficiaryNotFoundError(`Beneficiary ${beneficiaryId} not found for user ${userId}`);
        }

        const beneficiaryName = existingBeneficiary.beneficiaryName;
        const result = await this.beneficiaryRepository.delete(beneficiaryId);

        if (result instanceof BeneficiaryNotFoundError) {
            return result;
        }

        if (this.sendNotificationUseCase) {
            await this.sendNotificationUseCase.execute(
                userId,
                `Le bénéficiaire ${beneficiaryName} a été supprimé.`,
                NotificationTypeEnum.INFO
            );
        }

        return;
    }
}
