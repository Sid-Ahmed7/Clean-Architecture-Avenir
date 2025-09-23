import { AccountNotFoundError } from "../../../domain/errors/AccountNotFoundError";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class DeleteAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}
    
    public async execute(accountNumber: number) {

        const account = await this.accountRepository.deleteAccount(accountNumber);

        if(account instanceof AccountNotFoundError) {
            return account;
        }
    }
} 