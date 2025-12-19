import { AccountEntity } from "../../../domain/entities/AccountEntity";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { TransferLimitValue } from "../../../domain/values/TransferLimitValue";
import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { TransferLimitIncreaseError } from "../../errors/TransferLimitIncreaseError";
import { InvalidTransferLimitError } from "../../errors/InvalidTransferLimitError";

export class IncreaseTransferLimitUseCase {
    public constructor(private readonly accountRepository: AccountRepositoryInterface) {}

    public async execute(accountNumber: number, userId: string, limit: number): Promise<AccountEntity | Error> {
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if (account instanceof Error) {
            return account;
        }

        if (account.userId !== userId) {
            return new InvalidAccountError("Vous ne pouvez modifier que vos propres comptes");
        }

        const validatedLimit = TransferLimitValue.from(limit);
        if (validatedLimit instanceof Error) {
            return new InvalidTransferLimitError(validatedLimit.message);
        }

        if (validatedLimit.value <= account.transferLimit) {
            return new TransferLimitIncreaseError("La nouvelle limite doit être supérieure à la limite actuelle");
        }

        account.updateTransferLimit(validatedLimit.value);

        const updatedAccount = await this.accountRepository.updateOneAccount(account);
        if (updatedAccount instanceof Error) {
            return updatedAccount;
        }

        return updatedAccount;
    }
}

