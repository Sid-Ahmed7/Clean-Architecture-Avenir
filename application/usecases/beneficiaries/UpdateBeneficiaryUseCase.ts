import { BeneficiaryRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { UpdateBeneficiary } from "../../requests/UpdateBeneficiary";
import { BeneficiaryEntity } from "../../../domain/entities/BeneficiaryEntity";
import { BeneficiaryNotFoundError } from "../../errors/BeneficiaryNotFoundError";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class UpdateBeneficiaryUseCase {
    public constructor(
        private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ) {}

    public async execute(data: UpdateBeneficiary): Promise<BeneficiaryEntity | BeneficiaryNotFoundError | Error> {
        const existingBeneficiary = await this.beneficiaryRepository.getById(data.beneficiaryId);

        if (existingBeneficiary instanceof BeneficiaryNotFoundError) {
            return existingBeneficiary;
        }

        if (existingBeneficiary.userId !== data.userId) {
            return new BeneficiaryNotFoundError(`Beneficiary ${data.beneficiaryId} not found for user ${data.userId}`);
        }

        const updatedBeneficiary = BeneficiaryEntity.from(
            existingBeneficiary.beneficiaryId,
            existingBeneficiary.userId,
            existingBeneficiary.iban, 
            data.beneficiaryName ?? existingBeneficiary.beneficiaryName,
            data.email ?? existingBeneficiary.email,
            data.country ?? existingBeneficiary.country,
            data.address ?? (existingBeneficiary.address ? {
                street: existingBeneficiary.address.street,
                city: existingBeneficiary.address.city,
                postalCode: existingBeneficiary.address.postalCode,
                country: existingBeneficiary.address.country
            } : undefined),
            existingBeneficiary.isVerified,
            existingBeneficiary.createdAt,
            new Date() 
        );

        if (updatedBeneficiary instanceof Error) {
            return updatedBeneficiary;
        }

        const result = await this.beneficiaryRepository.update(updatedBeneficiary);

        if (result instanceof BeneficiaryNotFoundError) {
            return result;
        }

        if (this.sendNotificationUseCase) {
            await this.sendNotificationUseCase.execute(
                data.userId,
                `Le bénéficiaire ${updatedBeneficiary.beneficiaryName} a été mis à jour avec succès.`,
                NotificationTypeEnum.INFO
            );
        }

        return result;
    }
}
