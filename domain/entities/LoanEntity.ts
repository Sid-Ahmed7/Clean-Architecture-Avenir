import { LoanStatusEnum } from "../enums/LoanStatusEnum";
import { LoanTypeEnum } from "../enums/LoanTypeEnum";
import { PaymentHistory } from "../interfaces/PaymentHistory";
import { AnnualRateValue } from "../values/AnnualRateValue";
import { UserIdValue } from "../values/UserIdValue";

export class LoanEntity {
    public static from (loanId: number, userId: string, amount: number, annualRate: number, monthlyPayment: number, amountRemainingCapital: number, startDate: Date, endDate: Date, loanStatus: LoanStatusEnum, loanType: LoanTypeEnum, createBy: string, paymentHistory?: PaymentHistory) {
        {
            const validatedUserId = UserIdValue.from(userId) as UserIdValue | Error;
            if(validatedUserId instanceof Error) {
                return validatedUserId;
            }

            const validatedRate = AnnualRateValue.from(annualRate) as AnnualRateValue | Error;
            if(validatedRate instanceof Error) {
                return validatedRate;
            }

            const validatedCreatedBy = UserIdValue.from(createBy) as UserIdValue | Error;
            if(validatedCreatedBy instanceof Error) {
                return validatedCreatedBy;
            }
            return new LoanEntity(loanId, validatedUserId.value, amount, validatedRate.value, monthlyPayment, amountRemainingCapital, startDate, endDate, loanStatus, loanType, validatedCreatedBy.value, paymentHistory);
        }
    }
    private constructor(
        public loanId: number,
        public userId: string,
        public amount: number,
        public annualRate: number,
        public monthlyPayment: number,
        public amountRemainingCapital: number,
        public startDate: Date,
        public endDate: Date,
        public loanStatus: LoanStatusEnum,
        public loanType: LoanTypeEnum,
        public createdBy: string,
        public paymentHistory?: PaymentHistory
    ) {}
}