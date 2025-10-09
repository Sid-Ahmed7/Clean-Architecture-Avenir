import {IbanGeneratorService} from "../../../application/ports/services/IbanGeneratorService";
import { AccountRepositoryInterface } from "../../../application/ports/repositories/AccountRepositoryInterface";
import { InvalidIbanError } from "../../../domain/errors/InvalidIbanError";
import { IbanValue } from "../../../domain/values/IbanValue";
import { AccountNotFoundError } from "../../../application/errors/AccountNotFoundError";


export class GenerateIbanService implements IbanGeneratorService {

    constructor(private accountRepository: AccountRepositoryInterface){}
    

    public async generateIban(accountNumber: number): Promise<string | InvalidIbanError> {
        return this.generateRandomUniqueIban(accountNumber);
    }

 private async generateRandomUniqueIban(accountNumber: number): Promise<string | InvalidIbanError> {
    const bankCode = Math.floor(10000 + Math.random() * 89999).toString();
    const branchCode = Math.floor(10000 + Math.random() * 89999).toString();
    const ribKey = Math.floor(10 + Math.random() * 89).toString();

    const partialIban = bankCode + branchCode + accountNumber + ribKey;
    const ibanWithCheck = 'FR00' + partialIban;

    const checkDigits = IbanValue.calculateCheckDigits(ibanWithCheck);
    const fullIban = 'FR' + checkDigits + partialIban;

    const ibanValue = IbanValue.from(fullIban);
    if (ibanValue instanceof InvalidIbanError) {
      return this.generateRandomUniqueIban(accountNumber);
    }

    const existing = await this.accountRepository.getOneAccountByIban(ibanValue.value);
    if (!(existing instanceof AccountNotFoundError)) {
      return this.generateRandomUniqueIban(accountNumber);
    }

    return ibanValue.value;
  }
}