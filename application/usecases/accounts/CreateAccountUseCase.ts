import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { InvalidIbanError } from "../../../domain/errors/InvalidIbanError";
import {AccountNumberGeneratorService} from "../../ports/services/AccountNumberGeneratorService";
import {IbanGeneratorService} from "../../ports/services/IbanGeneratorService";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class CreateAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface, private accountNumberGenerator: AccountNumberGeneratorService, private ibanGenerator: IbanGeneratorService ){}

    public async execute(account: AccountEntity): Promise<AccountEntity | Error>{

        const accountNumber = await this.accountNumberGenerator.generateAccountNumber();
        if(accountNumber instanceof InvalidAccountError) {
            return accountNumber;
        }

        account.accountNumber = accountNumber.value;

        const iban = await this.ibanGenerator.generateIban(account.accountNumber);
        if(iban instanceof InvalidIbanError) {
            return iban;
        }
        
        account.iban = iban;

        const createdAccount = await this.accountRepository.createOneAccount(account);
        
        if(createdAccount instanceof Error) {
            return createdAccount;
        }

        return createdAccount;
    }
    
}