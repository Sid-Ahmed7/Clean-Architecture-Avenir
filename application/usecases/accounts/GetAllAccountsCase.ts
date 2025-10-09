import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";

export class GetAllAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(){

        const accounts = await this.accountRepository.getAllAccounts();

        if(accounts instanceof Error) {
            return accounts;
        }
        
        return accounts;
    }
}