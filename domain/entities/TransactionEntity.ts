import { OrderStatusEnum } from "../enums/OrderStatusEnum";
import { TransactionTypeEnum } from "../enums/TransactionTypeEnum";
import { AccountNumberValue } from "../values/AccountNumberValue";
import { TransactionAmountValue } from "../values/TransactionAmountValue";
import { TransactionReferenceValue } from "../values/TransactionReferenceValue";
import { UserIdValue } from "../values/UserIdValue";

export class TransactionEntity {

    public static from(
        transactionReference: string,
        debitAccount: number,
        creditAccount: number,
        amount: number,
        transactionType: TransactionTypeEnum,
        executedBy: string,
        status: OrderStatusEnum,
        createdAt: Date,
        description?: string,
        category?: string
    ) {

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

        return new TransactionEntity(
            validatedReference.value,
            validatedDebitAccount.value,
            validatedCreditAccount.value,
            validatedAmount.value,
            transactionType,
            validatedExecutedBy.value,
            status,
            description,
            category,
            createdAt
        );

    }

    private constructor(
        public readonly transactionReference: string,
        public readonly debitAccount: number,
        public readonly creditAccount: number,
        public readonly amount: number,
        public readonly transactionType: TransactionTypeEnum,
        public readonly executedBy: string,
        public status: OrderStatusEnum,
        public readonly description?: string,
        public readonly category?: string,
        public readonly createdAt?: Date,
        public  debitUserId?: string,
        public  creditUserId?: string,
        public  debitUserName?: string,
        public  creditUserName?: string
    ) {}
    }