import {
  CreateLoanRequestInput,
  LoanRequestRepositoryInterface,
} from "../../ports/repositories/LoanRequestRepositoryInterface";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { LoanRequestEntity } from "../../../domain/entities/LoanRequestEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { LoanConfigRepositoryInterface } from "../../ports/repositories/LoanConfigRepositoryInterface";
import { LoanStatusEnum } from "../../../domain/enums/LoanStatusEnum";

export class CreateLoanRequestUseCase {
  public constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
    private readonly loanConfigRepository: LoanConfigRepositoryInterface,
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
      return new Error("Advisor not found");
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
      return new Error(
        "Vous avez déjà une demande de crédit en cours. Merci d'attendre la décision avant d'en soumettre une nouvelle.",
      );
    }

    const id = this.uuidService.generate();
    const configRate = await this.loanConfigRepository.getIndicativeRate();

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

    return createdRequest;
  }
}

