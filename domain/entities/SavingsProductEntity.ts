import { ProductIdValue } from "../values/ProductIdValue";
import { ProductNameValue } from "../values/ProductNameValue";
import { ProductDescriptionValue } from "../values/ProductDescriptionValue";
import { InterestRateValue } from "../values/InterestRateValue";
import { MaxDepositAmountValue } from "../values/MaxDepositAmountValue";
import { MinDepositAmountValue } from "../values/MinDepositAmountValue";

export class SavingsProductEntity {
    public static create(
        id: string,
        name: string,
        description: string,
        interestRate: number,
        maxDepositAmount: number | null = null,
        minDepositAmount: number | null = null,
        isActive: boolean = true
    ): SavingsProductEntity | Error {
        // Validate all fields using Value Objects
        const validatedId = ProductIdValue.from(id);
        if (validatedId instanceof Error) {
            return validatedId;
        }

        const validatedName = ProductNameValue.from(name);
        if (validatedName instanceof Error) {
            return validatedName;
        }

        const validatedDescription = ProductDescriptionValue.from(description);
        if (validatedDescription instanceof Error) {
            return validatedDescription;
        }

        const validatedInterestRate = InterestRateValue.from(interestRate);
        if (validatedInterestRate instanceof Error) {
            return validatedInterestRate;
        }

        const validatedMaxDeposit = MaxDepositAmountValue.from(maxDepositAmount);
        if (validatedMaxDeposit instanceof Error) {
            return validatedMaxDeposit;
        }

        const validatedMinDeposit = MinDepositAmountValue.from(minDepositAmount);
        if (validatedMinDeposit instanceof Error) {
            return validatedMinDeposit;
        }

        // Validate that min is not greater than max
        if (validatedMinDeposit.value !== null && 
            validatedMaxDeposit.value !== null && 
            validatedMinDeposit.value > validatedMaxDeposit.value) {
            return new Error('Min deposit cannot be greater than max deposit');
        }

        return new SavingsProductEntity(
            validatedId.value,
            validatedName.value,
            validatedDescription.value,
            validatedInterestRate.value,
            validatedMaxDeposit.value,
            validatedMinDeposit.value,
            isActive,
            new Date(),
            new Date()
        );
    }

    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly interestRate: number,
        public readonly maxDepositAmount: number | null,
        public readonly minDepositAmount: number | null,
        public readonly isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {}

    public updateInterestRate(newRate: number): SavingsProductEntity | Error {
        const validatedRate = InterestRateValue.from(newRate);
        if (validatedRate instanceof Error) {
            return validatedRate;
        }

        return new SavingsProductEntity(
            this.id,
            this.name,
            this.description,
            validatedRate.value,
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
    ): SavingsProductEntity | Error {
        const validatedMaxDeposit = MaxDepositAmountValue.from(maxDepositAmount);
        if (validatedMaxDeposit instanceof Error) {
            return validatedMaxDeposit;
        }

        const validatedMinDeposit = MinDepositAmountValue.from(minDepositAmount);
        if (validatedMinDeposit instanceof Error) {
            return validatedMinDeposit;
        }

        // Validate that min is not greater than max
        if (validatedMinDeposit.value !== null && 
            validatedMaxDeposit.value !== null && 
            validatedMinDeposit.value > validatedMaxDeposit.value) {
            return new Error('Min deposit cannot be greater than max deposit');
        }

        return new SavingsProductEntity(
            this.id,
            this.name,
            this.description,
            this.interestRate,
            validatedMaxDeposit.value,
            validatedMinDeposit.value,
            this.isActive,
            this.createdAt,
            new Date()
        );
    }
}
