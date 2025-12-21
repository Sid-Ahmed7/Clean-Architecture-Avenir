import { BeneficiaryEntity } from "../../../domain/entities/BeneficiaryEntity";
import { BeneficiaryRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";

export class GetBeneficiariesByUserUseCase {
    public constructor(private readonly beneficiaryRepository: BeneficiaryRepositoryInterface){};

    public async execute(userId: string) : Promise<BeneficiaryEntity[]> {
       return this.beneficiaryRepository.getAllByUserId(userId);
    }
}