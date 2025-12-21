export class RepaymentNoCheckingAccountError extends Error {
    public constructor(message: string = "No checking account available for repayment") {
        super(message);
        this.name = "RepaymentNoCheckingAccountError";
    }
}

