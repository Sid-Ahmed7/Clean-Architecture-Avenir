import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class UpdateTransferLimitUseCase {

    public constructor(private readonly accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number, limit: number): Promise<AccountEntity | Error>{

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        account.updateTransferLimit(limit);

        const updatedTransferLimit = await this.accountRepository.updateOneAccount(account);

        if(updatedTransferLimit instanceof Error) {
            return updatedTransferLimit;
        }
        return updatedTransferLimit;
    }

    
}