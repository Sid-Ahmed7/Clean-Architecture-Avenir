import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class UpdateWithDrawalLimitUseCase {

    public constructor(private readonly accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number, limit: number): Promise<AccountEntity | Error> {

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        account.updateWithDrawalLimit(limit);

        const updatedWithDrawalLimit = await this.accountRepository.updateOneAccount(account);
        if(updatedWithDrawalLimit instanceof Error) {
            return updatedWithDrawalLimit;
        }
        return updatedWithDrawalLimit;
    }

    
}