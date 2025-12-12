import { LoanRequestRepositoryInterface } from "../../ports/repositories/LoanRequestRepositoryInterface";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../ports/repositories/auth/UserRoleRepositoryInterface";
import { LoanRequestEntity } from "../../../domain/entities/LoanRequestEntity";
import { RoleEnum } from "../../../domain/enums/RoleEnum";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";
import { UserNotFoundError } from "../../errors/UserNotFoundError";

export interface CreateLoanRequestInput {
  advisorId: string;
  amount: number;
  purpose: string;
}

export class CreateLoanRequestUseCase {
  public constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
  ) {}

  public async execute(clientId: string, input: CreateLoanRequestInput): Promise<LoanRequestEntity | Error> {
    const advisor = await this.userRepository.findById(input.advisorId);
    if (advisor instanceof UserNotFoundError) {
      return advisor;
    }

    const advisorRoles = await this.userRoleRepository.findRolesByUserId(input.advisorId);
    if (advisorRoles instanceof Error || !advisorRoles.find((r) => r.name === RoleEnum.BANK_ADVISOR)) {
      return new Error("Advisor not found");
    }

    const id = this.uuidService.generate();
    const request = LoanRequestEntity.create(
      id,
      clientId,
      input.advisorId,
      input.amount,
      input.purpose,
    );

    if (request instanceof Error) {
      return request;
    }

    return this.loanRequestRepository.create(request);
  }
}

