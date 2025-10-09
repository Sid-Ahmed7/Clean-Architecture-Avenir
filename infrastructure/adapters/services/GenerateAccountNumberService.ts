import { AccountRepositoryInterface } from "../../../application/ports/repositories/AccountRepositoryInterface";
import {AccountNumberGeneratorService} from "../../../application/ports/services/AccountNumberGeneratorService";
import { AccountNotFoundError } from "../../../application/errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { AccountNumberValue } from "../../../domain/values/AccountNumberValue";

export class GenerateAccountNumberService implements AccountNumberGeneratorService {


    constructor(private accountRepository: AccountRepositoryInterface){}

    public async generateAccountNumber(): Promise<AccountNumberValue | InvalidAccountError> {
        
        const randomAccountNumber = Math.floor(10000000000 + Math.random() * 90000000000);
        const accountNumberValue = AccountNumberValue.from(randomAccountNumber);

        if(accountNumberValue instanceof InvalidAccountError) {
            return this.generateAccountNumber();
        }

        const existingAccountNumber = await this.accountRepository.getOneAccountByAccountNumber(randomAccountNumber);

        if (!(existingAccountNumber instanceof AccountNotFoundError)) {
            return this.generateAccountNumber()
        } 

        return accountNumberValue;


    }



} 