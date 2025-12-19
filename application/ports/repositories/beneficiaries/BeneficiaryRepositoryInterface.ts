import { BeneficiaryEntity } from "../../../../domain/entities/BeneficiaryEntity";
import { BeneficiaryAlreadyExistsError } from "../../../errors/BeneficiaryAlreadyExistsError";
import { BeneficiaryNotFoundError } from "../../../errors/BeneficiaryNotFoundError";

export interface BeneficiaryRepositoryInterface {
    create(beneficiary: BeneficiaryEntity): Promise<BeneficiaryEntity | BeneficiaryAlreadyExistsError>
    getById(beneficiaryId: string): Promise<BeneficiaryEntity | BeneficiaryNotFoundError>;
    getByIban(iban: string, userId: string): Promise<BeneficiaryEntity | BeneficiaryNotFoundError>;
    getAllByUserId(userId: string): Promise<BeneficiaryEntity[]>;
    update(beneficiary: BeneficiaryEntity): Promise<BeneficiaryEntity | BeneficiaryNotFoundError>;
    delete(beneficiaryId: string): Promise<void | BeneficiaryNotFoundError>;
}