export class MaxDepositAmountValue {
    private static MIN_AMOUNT = 0;
    private static MAX_AMOUNT = 10000000; // 10 million max

    public static from(amount: number | null | undefined): MaxDepositAmountValue | Error {
        // null or undefined means no limit
        if (amount === null || amount === undefined) {
            return new MaxDepositAmountValue(null);
        }

        if (amount < this.MIN_AMOUNT) {
            return new Error(`Max deposit amount must be positive, got ${amount}`);
        }

        if (amount > this.MAX_AMOUNT) {
            return new Error(`Max deposit amount cannot exceed ${this.MAX_AMOUNT}, got ${amount}`);
        }

        return new MaxDepositAmountValue(amount);
    }

    private constructor(public value: number | null) {}
}
