import { BeneficiaryRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import {UuidGeneratorService} from "../../ports/services/UuidGeneratorService";
import { CreateBeneficiary } from "../../requests/CreateBeneficiary";
import { BeneficiaryEntity } from "../../../domain/entities/BeneficiaryEntity";
import { BeneficiaryAlreadyExistsError } from "../../errors/BeneficiaryAlreadyExistsError";
import { IbanNotFoundError } from "../../errors/IbanNotFoundError";



export class CreateBeneficiaryUseCase {
    public constructor(
        private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly uuidService: UuidGeneratorService
    ){}

    public async execute(data: CreateBeneficiary  ): Promise<BeneficiaryEntity | BeneficiaryAlreadyExistsError | IbanNotFoundError | Error> {

      const account = await this.accountRepository.getOneAccountByIban(data.iban);

    if (account instanceof Error) {
      return new IbanNotFoundError(`IBAN ${data.iban} does not exist in the system`);
    }
    
    const existingBeneficiary = await this.beneficiaryRepository.getByIban(data.iban, data.userId);
    if (!(existingBeneficiary instanceof Error)) {
      return new BeneficiaryAlreadyExistsError(`Beneficiary with IBAN ${data.iban} already exists`);
    }

    const beneficiaryId = this.uuidService.generate();
    const  isVerified = true;

    const beneficiary = BeneficiaryEntity.from(
        beneficiaryId,
        data.userId,
        data.iban,
        data.beneficiaryName,
        data.email,
        data.country,
        data.address,
        isVerified
    );

    if (beneficiary instanceof Error) {
        return beneficiary;
    }

    const createBeneficiary = await this.beneficiaryRepository.create(beneficiary);

    if(createBeneficiary instanceof Error) {
        return createBeneficiary;
    }

    return createBeneficiary;

    }
}