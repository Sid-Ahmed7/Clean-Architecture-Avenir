import { InvalidAccountError } from "../errors/InvalidAccountError";

export class SavingsProductEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly interestRate: number,
        public readonly maxDepositAmount: number | null,
        public readonly minDepositAmount: number | null,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.id || this.id.trim() === '') {
            throw new InvalidAccountError('Product ID is required');
        }

        if (!this.name || this.name.trim() === '') {
            throw new InvalidAccountError('Product name is required');
        }

        if (this.interestRate < 0 || this.interestRate > 100) {
            throw new InvalidAccountError('Interest rate must be between 0 and 100');
        }

        if (this.maxDepositAmount !== null && this.maxDepositAmount <= 0) {
            throw new InvalidAccountError('Max deposit amount must be positive');
        }

        if (this.minDepositAmount !== null && this.minDepositAmount <= 0) {
            throw new InvalidAccountError('Min deposit amount must be positive');
        }

        if (this.minDepositAmount !== null && this.maxDepositAmount !== null && 
            this.minDepositAmount > this.maxDepositAmount) {
            throw new InvalidAccountError('Min deposit cannot be greater than max deposit');
        }
    }

    public static create(
        id: string,
        name: string,
        description: string,
        interestRate: number,
        maxDepositAmount: number | null = null,
        minDepositAmount: number | null = null,
        isActive: boolean = true
    ): SavingsProductEntity {
        return new SavingsProductEntity(
            id,
            name,
            description,
            interestRate,
            maxDepositAmount,
            minDepositAmount,
            isActive,
            new Date(),
            new Date()
        );
    }

    public updateInterestRate(newRate: number): SavingsProductEntity {
        return new SavingsProductEntity(
            this.id,
            this.name,
            this.description,
            newRate,
            this.maxDepositAmount,
            this.minDepositAmount,
            this.isActive,
            this.createdAt,
            new Date()
        );
    }

    public updateStatus(isActive: boolean): SavingsProductEntity {
        return new SavingsProductEntity(
            this.id,
            this.name,
            this.description,
            this.interestRate,
            this.maxDepositAmount,
            this.minDepositAmount,
            isActive,
            this.createdAt,
            new Date()
        );
    }

    public updateLimits(
        maxDepositAmount: number | null,
        minDepositAmount: number | null
    ): SavingsProductEntity {
        return new SavingsProductEntity(
            this.id,
            this.name,
            this.description,
            this.interestRate,
            maxDepositAmount,
            minDepositAmount,
            this.isActive,
            this.createdAt,
            new Date()
        );
    }
}
