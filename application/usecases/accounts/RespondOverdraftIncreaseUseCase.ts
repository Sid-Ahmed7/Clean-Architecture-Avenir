import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { OverdraftRequestRepositoryInterface } from "../../ports/repositories/OverdraftRequestRepositoryInterface";
import { OverdraftRequestStatusEnum } from "../../../domain/enums/OverdraftRequestStatusEnum";
import { OverdraftActionEnum } from "../../../domain/enums/OverdraftActionEnum";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { OverdraftRequestNotFoundError } from "../../errors/OverdraftRequestNotFoundError";
import { OverdraftRequestAlreadyProcessedError } from "../../../domain/errors/OverdraftRequestAlreadyProcessedError";
import { InvalidOverdraftActionError } from "../../errors/InvalidOverdraftActionError";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class RespondOverdraftIncreaseUseCase {
    public constructor(
        private readonly overdraftRequestRepository: OverdraftRequestRepositoryInterface,
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
    ) {}

    public async execute(requestId: string, action: OverdraftActionEnum) {
        const request = await this.overdraftRequestRepository.findById(requestId);
        if (!request) {
            return new OverdraftRequestNotFoundError();
        }

        if (request.status !== OverdraftRequestStatusEnum.PENDING) {
            return new OverdraftRequestAlreadyProcessedError();
        }

        const account = await this.accountRepository.getOneAccountByAccountNumber(request.accountNumber);
        if (account instanceof AccountNotFoundError) {
            return account;
        }

        if (account.userId !== request.userId) {
            return new InvalidAccountError("The account of the request does not belong to the client");
        }

        if (action === OverdraftActionEnum.APPROVE) {
            const updatedStatus = request.approve();
            if (updatedStatus instanceof Error) {
                return updatedStatus;
            }
            account.updateOverdraftLimit(request.requestedOverdraftLimit);
            const updatedAccount = await this.accountRepository.updateOneAccount(account);
            if (updatedAccount instanceof Error) {
                return updatedAccount;
            }

            if (this.sendNotificationUseCase) {
                await this.sendNotificationUseCase.execute(
                    request.userId,
                    `Votre demande d'augmentation de découvert à ${request.requestedOverdraftLimit}€ a été approuvée !`,
                    NotificationTypeEnum.ALERT
                );
            }
        } else if (action === OverdraftActionEnum.REJECT) {
            const rejectedStatus = request.reject();
            if (rejectedStatus instanceof Error) {
                return rejectedStatus;
            }

            if (this.sendNotificationUseCase) {
                await this.sendNotificationUseCase.execute(

                    request.userId,
                    `Votre demande d'augmentation de découvert à ${request.requestedOverdraftLimit}€ a été refusée.`,
                    NotificationTypeEnum.ALERT
                );
            }
        } else {
            return new InvalidOverdraftActionError();
        }

        const savedRequest = await this.overdraftRequestRepository.save(request);
        return savedRequest;
    }
}

