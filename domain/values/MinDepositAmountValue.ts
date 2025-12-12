export class MinDepositAmountValue {
    private static MIN_AMOUNT = 0;
    private static MAX_AMOUNT = 10000000; // 10 million max

    public static from(amount: number | null | undefined): MinDepositAmountValue | Error {
        // null or undefined means no minimum
        if (amount === null || amount === undefined) {
            return new MinDepositAmountValue(null);
        }

        if (amount < this.MIN_AMOUNT) {
            return new Error(`Min deposit amount must be positive, got ${amount}`);
        }

        if (amount > this.MAX_AMOUNT) {
            return new Error(`Min deposit amount cannot exceed ${this.MAX_AMOUNT}, got ${amount}`);
        }

        return new MinDepositAmountValue(amount);
    }

    private constructor(public readonly value: number | null) {}
}
