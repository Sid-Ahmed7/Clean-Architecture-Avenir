import { AccountEntity } from "../../../domain/entities/AccountEntity";

export interface TransferValidationService {
    validateTransfer(debitAccount: AccountEntity,creditAccount: AccountEntity,amount: number,userId: string): Error | null;
}
