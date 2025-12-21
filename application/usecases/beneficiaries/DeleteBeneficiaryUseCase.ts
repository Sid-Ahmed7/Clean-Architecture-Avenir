import { BeneficiaryRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { BeneficiaryNotFoundError } from "../../errors/BeneficiaryNotFoundError";

export class DeleteBeneficiaryUseCase {
    public constructor(private readonly beneficiaryRepository: BeneficiaryRepositoryInterface) {}

    public async execute(beneficiaryId: string, userId: string): Promise<void | BeneficiaryNotFoundError | Error> {
        const existingBeneficiary = await this.beneficiaryRepository.getById(beneficiaryId);

        if (existingBeneficiary instanceof BeneficiaryNotFoundError) {
            return existingBeneficiary;
        }

        if (existingBeneficiary.userId !== userId) {
            return new BeneficiaryNotFoundError(`Beneficiary ${beneficiaryId} not found for user ${userId}`);
        }

        const result = await this.beneficiaryRepository.delete(beneficiaryId);

        if (result instanceof BeneficiaryNotFoundError) {
            return result;
        }

        return;
    }
}
