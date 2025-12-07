import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class UpdateOverdraftLimitUseCase {

    public constructor(private readonly accountRepository: AccountRepositoryInterface){}

    public async execute(accountNumber: number, limit: number) : Promise<AccountEntity | Error> {

        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if( account instanceof Error) {
            return account;
        }

        account.updateOverdraftLimit(limit);

        const updateOverdraftLimit = await this.accountRepository.updateOneAccount(account);
        
        if(updateOverdraftLimit instanceof Error) {
            return updateOverdraftLimit;
        }

        return updateOverdraftLimit;
    }

    
}