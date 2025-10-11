import { AccountEntity } from "../../../domain/entities/AccountEntity";
import {CreateAccountDTO} from "./dto/CreateAccountDTO";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { InvalidIbanError } from "../../../domain/errors/InvalidIbanError";
import {AccountNumberGeneratorService} from "../../ports/services/AccountNumberGeneratorService";
import {IbanGeneratorService} from "../../ports/services/IbanGeneratorService";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { AccountStatusEnum } from "../../../domain/enums/AccountStatusEnum";
import { AccountTypeEnum } from "../../../domain/enums/AccountTypeEnum";

export class CreateAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface, private accountNumberGenerator: AccountNumberGeneratorService, private ibanGenerator: IbanGeneratorService ){}

    public async execute(accountDTO: CreateAccountDTO): Promise<AccountEntity | Error>{

        const accountNumber = await this.accountNumberGenerator.generateAccountNumber();
        if(accountNumber instanceof InvalidAccountError) {
            return accountNumber;
        }


        const iban = await this.ibanGenerator.generateIban(accountNumber);
        
        if(iban instanceof InvalidIbanError) {
            return iban;
        }


        const checkingAccount = await this.accountRepository.findByUserIdAndType(accountDTO.userId, AccountTypeEnum.CHECKING);
        if(checkingAccount instanceof Error) {
            return checkingAccount;
        }
        
        const account = AccountEntity.from(
            accountNumber,                  
            iban,                                 
            accountDTO.userId,
            accountDTO.accountType,
            accountDTO.currency,
            AccountStatusEnum.ACTIVE,
            true,     
            20,                               
            new Date(),
            3000,
            3000,
            1000,
            accountDTO.customAccountName ?? `${accountNumber}`,
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