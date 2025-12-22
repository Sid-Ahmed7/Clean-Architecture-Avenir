import { OverdraftRequestStatusEnum } from "../enums/OverdraftRequestStatusEnum";
import { OverdraftLimitValue } from "../values/OverdraftLimitValue";
import { InvalidOverdraftRequestError } from "../errors/InvalidOverdraftRequestError";
import { OverdraftRequestAlreadyProcessedError } from "../errors/OverdraftRequestAlreadyProcessedError";

export class OverdraftIncreaseRequestEntity {
    public static from(
        id: string,
        accountNumber: number,
        userId: string,
        currentOverdraftLimit: number,
        requestedOverdraftLimit: number,
        createdAt: Date = new Date(),
        status: OverdraftRequestStatusEnum = OverdraftRequestStatusEnum.PENDING,
    ): OverdraftIncreaseRequestEntity | Error {
        const validatedCurrent = OverdraftLimitValue.from(currentOverdraftLimit);
        if (validatedCurrent instanceof Error) {
            return validatedCurrent;
        }

        const validatedRequested = OverdraftLimitValue.from(requestedOverdraftLimit);
        if (validatedRequested instanceof Error) {
            return validatedRequested;
        }

        if (validatedRequested.value <= validatedCurrent.value) {
            return new InvalidOverdraftRequestError("Requested overdraft must be greater than current overdraft");
        }

        return new OverdraftIncreaseRequestEntity(
            id,
            accountNumber,
            userId,
            validatedCurrent.value,
            validatedRequested.value,
            status,
            createdAt,
        );
    }

    private constructor(
        public readonly id: string,
        public readonly accountNumber: number,
        public readonly userId: string,
        public readonly currentOverdraftLimit: number,
        public readonly requestedOverdraftLimit: number,
        public status: OverdraftRequestStatusEnum,
        public readonly createdAt: Date,
    ) {}

    public approve() {
        if (this.status !== OverdraftRequestStatusEnum.PENDING) {
            return new OverdraftRequestAlreadyProcessedError();
        }
        this.status = OverdraftRequestStatusEnum.APPROVED;
        return this;
    }

    public reject() {
        if (this.status !== OverdraftRequestStatusEnum.PENDING) {
            return new OverdraftRequestAlreadyProcessedError();
        }
        this.status = OverdraftRequestStatusEnum.REJECTED;
        return this;
    }
}

