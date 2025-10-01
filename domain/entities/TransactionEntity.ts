import { OrderStatusEnum } from "../enums/OrderStatusEnum";
import { TransactionTypeEnum } from "../enums/TransactionTypeEnum";
import { AccountNumberValue } from "../values/AccountNumberValue";
import { TransactionAmountValue } from "../values/TransactionAmountValue";
import { TransactionReferenceValue } from "../values/TransactionReferenceValue";
import { UserIdValue } from "../values/UserIdValue";

export class TransactionEntity {

    public static from(debitAccount: number, creditAccount: number, amount: number, transactionReference: string, transactionType: TransactionTypeEnum, executedBy: string, status: OrderStatusEnum, createdAt: Date, description?: string,  category?: string, ) {

        const validatedDebitAccount = AccountNumberValue.from(debitAccount);
        if(validatedDebitAccount instanceof Error) {
            return validatedDebitAccount;
        }

        const validatedCreditAccount = AccountNumberValue.from(creditAccount);
        if(validatedCreditAccount instanceof Error) {
            return validatedCreditAccount;
        }

        const validatedAmount = TransactionAmountValue.from(amount);
        if(validatedAmount instanceof Error) {
            return validatedAmount;
        }

        const validatedExecutedBy = UserIdValue.from(executedBy);
        if(validatedExecutedBy instanceof Error) {
            return validatedExecutedBy;
        }

        const validatedReference = TransactionReferenceValue.from(transactionReference);
        if(validatedReference instanceof Error) {
            return validatedReference;
        }

        return new TransactionEntity(validatedDebitAccount.value, validatedCreditAccount.value, validatedAmount.value, transactionType, validatedExecutedBy.value, status, validatedReference.value, description, category, createdAt);

    }

    private constructor(
        public debitAccount: number,
        public creditAccount: number,
        public amount: number,
        public transactionType: TransactionTypeEnum,
        public executedBy: string,
        public status: OrderStatusEnum,
        public transactionReference: string,
        public description?: string,
        public category?: string,
        public createdAt?: Date
    ) {}
    }