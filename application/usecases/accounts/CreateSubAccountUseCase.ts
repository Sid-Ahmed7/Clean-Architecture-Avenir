import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { InvalidIbanError } from "../../../domain/errors/InvalidIbanError";
import {AccountNumberGeneratorService} from "../../ports/services/AccountNumberGeneratorService";
import {IbanGeneratorService} from "../../ports/services/IbanGeneratorService";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { CreateSubAccount } from "../../requests/CreateSubAccount";

export class CreateSubAccountUseCase {
    public constructor ( private readonly accountRepository: AccountRepositoryInterface, private readonly accountNumberGenerator: AccountNumberGeneratorService, private readonly ibanGenerator: IbanGeneratorService ){}

    public async execute(accountData: CreateSubAccount): Promise<AccountEntity | Error>{

        if (!accountData.parentAccountId) {
            return new Error("A sub-account must have a parent");
        }

        const parentAccountNumber = await this.accountRepository.getOneAccountById(accountData.parentAccountId);

        if(parentAccountNumber instanceof AccountNotFoundError) {
            return parentAccountNumber;
        }
        if (parentAccountNumber.parentAccountId) {
            return new Error("Cannot create a sub-account of a sub-account");
        }

        if (parentAccountNumber.userId !== accountData.userId) {
            return new Error("Parent account does not belong to this user");
        }



        const accountNumber = await this.accountNumberGenerator.generateAccountNumber();
        
        if(accountNumber instanceof InvalidAccountError) {
            return accountNumber;
        }


        const iban = await this.ibanGenerator.generateIban(accountNumber);
        
        if(iban instanceof InvalidIbanError) {
            return iban;
        }
        
        const account = AccountEntity.from(
            accountNumber,
            iban,
            accountData.userId,
            accountData.accountType,
            accountData.currency,
            AccountStatusEnum.ACTIVE,
            true,
            0,
            new Date(),
            3000,
            3000,
            1000,
            accountData.customAccountName ?? `${accountNumber}`,
            0,
            new Date(),
            accountData.parentAccountId
        );

        if(account instanceof Error) {
            return account;
        }

        const createdAccount = await this.accountRepository.createOneAccount(account);
        
        if(createdAccount instanceof Error) {
            return createdAccount;
        }

        return createdAccount;
    }
    
}