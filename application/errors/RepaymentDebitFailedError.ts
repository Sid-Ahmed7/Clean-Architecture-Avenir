export class RepaymentDebitFailedError extends Error {
    public constructor(message: string = "Debit failed during repayment processing") {
        super(message);
        this.name = "RepaymentDebitFailedError";
    }
}

