import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { CreateLoanRequestInput } from "../../requests/CreateLoanRequest";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { LoanRequestEntity } from "../../../domain/entities/LoanRequestEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { LoanConfigService } from "../../ports/services/LoanConfigService";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";
import { AdvisorNotFoundError } from "../../errors/AdvisorNotFoundError";
import { ActiveLoanRequestExistsError } from "../../errors/ActiveLoanRequestExistsError";
import { SendNotificationToClientUseCase } from "../notification/SendNotificationToClientUseCase";
import { NotificationTypeEnum } from "../../../domain/enums/NotificationTypeEnum";

export class CreateLoanRequestUseCase {
  public constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
    private readonly loanConfigService: LoanConfigService,
    private readonly sendNotificationUseCase: SendNotificationToClientUseCase,
  ) {}

  public async execute(clientId: string, input: CreateLoanRequestInput): Promise<LoanRequestEntity | Error> {
    const advisor = await this.userRepository.findById(input.advisorId);
    if (advisor instanceof UserNotFoundError) {
      return advisor;
    }
    const advisorName = [advisor.firstName, advisor.lastName].filter(Boolean).join(" ").trim() || advisor.email || advisor.id;

    const client = await this.userRepository.findById(clientId);
    const clientName =
      client instanceof Error
        ? undefined
        : [client.firstName, client.lastName].filter(Boolean).join(" ").trim() || client.email || client.id;

    const advisorRoles = await this.userRoleRepository.findRolesByUserId(input.advisorId);
    if (advisorRoles instanceof Error || !advisorRoles.find((r) => r.name === RoleEnum.BANK_ADVISOR)) {
      return new AdvisorNotFoundError("Advisor not found or not a bank advisor");
    }

    const existing = await this.loanRequestRepository.findByClient(clientId);
    const nonFinalStatuses = [
      LoanStatusEnum.PENDING,
      LoanStatusEnum.ADVISOR_APPROVED,
      LoanStatusEnum.RATE_PROPOSED,
      LoanStatusEnum.DIRECTOR_APPROVED,
    ];
    const hasActive = existing.some((r) => nonFinalStatuses.includes(r.status));
    if (hasActive) {
      return new ActiveLoanRequestExistsError(
        "There is already an active loan request. Please wait for a decision before submitting a new one.",
      );
    }

    const id = this.uuidService.generate();
    await this.loanConfigService.getIndicativeRate();

    const request = LoanRequestEntity.create(
      id,
      clientId,
      input.advisorId,
      input.amount,
      input.purpose,
      input.durationMonths ?? 12,
      advisorName,
      undefined,
      clientName,
    );

    if (request instanceof Error) {
      return request;
    }

    const createdRequest = await this.loanRequestRepository.create(request);
    if (createdRequest instanceof Error) {
      return createdRequest;
    }

    if (this.sendNotificationUseCase) {
      await this.sendNotificationUseCase.execute(
        clientId,
        `Votre demande de prêt de ${input.amount}€ a été soumise avec succès.`,
        NotificationTypeEnum.INFO
      );
    }

    return createdRequest;
  }
}

