import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { OverdraftRequestRepositoryInterface } from "../../ports/repositories/OverdraftRequestRepositoryInterface";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { PendingOverdraftRequestError } from "../../errors/PendingOverdraftRequestError";
import { InvalidOverdraftRequestError } from "../../../domain/errors/InvalidOverdraftRequestError";
import { OverdraftIncreaseRequestEntity } from "../../../domain/entities/OverdraftIncreaseRequestEntity";
import { OverdraftLimitValue } from "../../../domain/values/OverdraftLimitValue";

export class RequestOverdraftIncreaseUseCase {
    public constructor(
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly overdraftRequestRepository: OverdraftRequestRepositoryInterface,
        private readonly uuidService: UuidGeneratorService,
    ) {}

    public async execute(accountNumber: number, userId: string, requestedOverdraftLimit: number): Promise<OverdraftIncreaseRequestEntity | Error> {
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);

        if (account instanceof AccountNotFoundError) {
            return account;
        }

        if (account.userId !== userId) {
            return new InvalidAccountError("This account does not belong to you");
        }

        const validatedRequested = OverdraftLimitValue.from(requestedOverdraftLimit);
        if (validatedRequested instanceof Error) {
            return new InvalidOverdraftRequestError(validatedRequested.message);
        }

        if (validatedRequested.value <= account.overdraftLimit) {
            return new InvalidOverdraftRequestError("Requested overdraft must be greater than current overdraft");
        }

        const existingRequests = await this.overdraftRequestRepository.findByUserId(userId);
        const hasPending = existingRequests.some((req) => req.status === "PENDING");
        if (hasPending) {
            return new PendingOverdraftRequestError();
        }

        const requestId = this.uuidService.generate();
        const request = OverdraftIncreaseRequestEntity.from(
            requestId,
            account.accountNumber,
            account.userId,
            account.overdraftLimit,
            validatedRequested.value,
        );

        if (request instanceof Error) {
            return request;
        }

        return this.overdraftRequestRepository.create(request);
    }
}

