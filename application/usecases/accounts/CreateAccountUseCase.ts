import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { InvalidIbanError } from "../../../domain/errors/InvalidIbanError";
import { AccountNumberValue } from "../../../domain/values/AccountNumberValue";
import { IbanValue } from "../../../domain/values/IbanValue";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class CreateAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    private async generateUniqueAccountNumber(partialAccountNumber: string = '') : Promise<number | InvalidAccountError > {

        const generatedAccountNumber = AccountNumberValue.generateAccountNumber(partialAccountNumber);

        if(generatedAccountNumber instanceof InvalidAccountError) {
            return generatedAccountNumber ;
        }

        const existingAccount = await this.accountRepository.getOneAccountByAccountNumber(generatedAccountNumber.value);
        
        if(existingAccount instanceof Error) {
            return generatedAccountNumber.value;
        }

        return await this.generateUniqueAccountNumber();
    }

        private async generateUniqueIban(accountNumber: number) : Promise<string | InvalidIbanError > {

        const generatedIban = IbanValue.generateIban(accountNumber);

        if(generatedIban instanceof InvalidIbanError) {
            return generatedIban ;
        }

        const allAccounts = await this.accountRepository.getAllAccounts();
        

        const existingAccountWithIban = allAccounts.some((account) => account.iban === generatedIban.value);
        
        if(!existingAccountWithIban) {
            return generatedIban.value;
        }

        return await this.generateUniqueIban(accountNumber);
    }


    public async execute(account: AccountEntity): Promise<AccountEntity | Error>{

        const accountNumber = await this.generateUniqueAccountNumber();
        if(accountNumber instanceof InvalidAccountError) {
            return accountNumber;
        }

        account.accountNumber = accountNumber;

        const iban = await this.generateUniqueIban(accountNumber);
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