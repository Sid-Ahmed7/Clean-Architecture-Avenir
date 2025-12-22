export class RepaymentUserNotFoundError extends Error {
    public constructor(message: string = "User not found for repayment processing") {
        super(message);
        this.name = "RepaymentUserNotFoundError";
    }
}

