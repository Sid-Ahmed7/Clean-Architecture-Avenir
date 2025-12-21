import { BeneficiaryRepositoryInterface } from "../../ports/repositories/beneficiaries/BeneficiaryRepositoryInterface";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import {UuidGeneratorService} from "../../ports/services/UuidGeneratorService";
import { CreateBeneficiary } from "../../requests/CreateBeneficiary";
import { BeneficiaryEntity } from "../../../domain/entities/BeneficiaryEntity";
import { BeneficiaryAlreadyExistsError } from "../../errors/BeneficiaryAlreadyExistsError";
import { IbanNotFoundError } from "../../errors/IbanNotFoundError";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";



export class CreateBeneficiaryUseCase {
    public constructor(
        private readonly beneficiaryRepository: BeneficiaryRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly uuidService: UuidGeneratorService,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
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

    if (this.sendNotificationUseCase) {
        await this.sendNotificationUseCase.execute(
            data.userId,
            `Le bénéficiaire ${data.beneficiaryName} a été ajouté avec succès !`,
            NotificationTypeEnum.INFO
        );
    }

    if (this.sendNotificationUseCase && account.userId !== data.userId) {
        await this.sendNotificationUseCase.execute(
            account.userId,
            `Vous avez été ajouté comme bénéficiaire par un autre utilisateur.`,
            NotificationTypeEnum.INFO,
            data.userId,

        );
    }

    return createBeneficiary;

    }
}