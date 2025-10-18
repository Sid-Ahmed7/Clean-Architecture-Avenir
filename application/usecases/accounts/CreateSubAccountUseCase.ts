import { AccountEntity } from "../../../domain/entities/AccountEntity";
import {CreateAccountDTO} from "./dto/CreateAccountDTO";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { InvalidIbanError } from "../../../domain/errors/InvalidIbanError";
import {AccountNumberGeneratorService} from "../../ports/services/AccountNumberGeneratorService";
import {IbanGeneratorService} from "../../ports/services/IbanGeneratorService";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";

export class CreateSubAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface, private accountNumberGenerator: AccountNumberGeneratorService, private ibanGenerator: IbanGeneratorService ){}

    public async execute(accountDTO: CreateAccountDTO): Promise<AccountEntity | Error>{

        if (!accountDTO.parentAccountId) {
            return new Error("A sub-account must have a parent");
        }

        const parentAccountNumber = await this.accountRepository.getOneAccountById(accountDTO.parentAccountId);

        if(parentAccountNumber instanceof AccountNotFoundError) {
            return parentAccountNumber;
        }
        if (parentAccountNumber.parentAccountId) {
            return new Error("Cannot create a sub-account of a sub-account");
        }

        if (parentAccountNumber.userId !== accountDTO.userId) {
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
            accountDTO.userId,
            accountDTO.accountType,
            accountDTO.currency,
            AccountStatusEnum.ACTIVE,
            true,     
            0,                               
            new Date(),
            3000,
            3000,
            1000,
            accountDTO.customAccountName ?? `${accountNumber}`,
            accountDTO.parentAccountId
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