import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { AccountNotFoundError } from "../../../domain/errors/AccountNotFoundError";
import { AccountRepositoryInterface } from "../../repositories/AccountRepositoryInterface";

export class GetAccountUseCase {
    public constructor ( private accountRepository: AccountRepositoryInterface){}

    public async execute(){

        const accounts = await this.accountRepository.getAllAccounts();

        return accounts;
    }
}