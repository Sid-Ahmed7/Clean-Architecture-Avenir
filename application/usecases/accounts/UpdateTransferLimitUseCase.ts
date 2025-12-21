import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { TransferLimitValue } from "../../../domain/values/TransferLimitValue";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { InvalidTransferLimitError } from "../../errors/InvalidTransferLimitError";

export class UpdateTransferLimitUseCase {

    public constructor(private readonly accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number, limit: number): Promise<AccountEntity | Error>{

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        const validatedLimit = TransferLimitValue.from(limit);
        if (validatedLimit instanceof Error) {
            return new InvalidTransferLimitError(validatedLimit.message);
        }

        account.updateTransferLimit(validatedLimit.value);

        const updatedTransferLimit = await this.accountRepository.updateOneAccount(account);

        if(updatedTransferLimit instanceof Error) {
            return updatedTransferLimit;
        }
        return updatedTransferLimit;
    }

    
}