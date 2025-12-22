import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { CreateAccount} from "../../requests/CreateAccount";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { InvalidIbanError } from "../../../domain/errors/InvalidIbanError";
import {AccountNumberGeneratorService} from "../../ports/services/AccountNumberGeneratorService";
import {IbanGeneratorService} from "../../ports/services/IbanGeneratorService";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class CreateAccountUseCase {
    public constructor(
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly accountNumberGenerator: AccountNumberGeneratorService,
        private readonly ibanGenerator: IbanGeneratorService,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ){}

    public async execute(accountData: CreateAccount): Promise<AccountEntity | Error>{

        const accountNumber = await this.accountNumberGenerator.generateAccountNumber();
        if(accountNumber instanceof InvalidAccountError) {
            return accountNumber;
        }

        const iban = await this.ibanGenerator.generateIban(accountNumber);
        
        if(iban instanceof InvalidIbanError) {
            return iban;
        }

        const checkingAccount = await this.accountRepository.findByUserIdAndType(accountData.userId, AccountTypeEnum.CHECKING);
        if(checkingAccount instanceof Error) {
            return checkingAccount;
        }
        
        const account = AccountEntity.from(
            accountNumber,
            iban,
            accountData.userId,
            accountData.accountType,
            accountData.currency,
            AccountStatusEnum.ACTIVE,
            true,
            20,
            new Date(),
            3000,
            3000,
            1000,
            accountData.customAccountName ?? `${accountNumber}`,
            0,
            new Date()
        );

        if(account instanceof Error) {
            return account;
        }

        const createdAccount = await this.accountRepository.createOneAccount(account);

        if(createdAccount instanceof Error) {
            return createdAccount;
        }

        if (this.sendNotificationUseCase) {
            await this.sendNotificationUseCase.execute(
                accountData.userId,
                `Votre compte a été créé avec succès !`,
                NotificationTypeEnum.INFO
            );
        }

        return createdAccount;
    }

}