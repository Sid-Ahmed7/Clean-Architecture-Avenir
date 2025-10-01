import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class UpdateTransferLimitUseCase {

    public constructor(private accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number, limit: number) {

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        account.updateTransferLimit(limit);

        const updatedTransferLimit = await this.accountRepository.updateOneAccount(account);
        return updatedTransferLimit;
    }

    
}