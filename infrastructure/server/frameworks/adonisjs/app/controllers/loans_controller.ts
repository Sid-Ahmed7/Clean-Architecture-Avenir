import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CreateLoanRequestUseCase } from "#application/usecases/loan/CreateLoanRequestUseCase.js";
import { ListAdvisorLoanRequestsUseCase } from "#application/usecases/loan/ListAdvisorLoanRequestsUseCase.js";
import { ListClientLoanRequestsUseCase } from "#application/usecases/loan/ListClientLoanRequestsUseCase.js";
import { AdvisorDecideLoanRequestUseCase } from "#application/usecases/loan/AdvisorDecideLoanRequestUseCase.js";
import { DirectorDecideLoanRequestUseCase } from "#application/usecases/loan/DirectorDecideLoanRequestUseCase.js";
import { ListAdvisorApprovedRequestsUseCase } from "#application/usecases/loan/ListAdvisorApprovedRequestsUseCase.js";
import { DirectorProposeRateUseCase } from "#application/usecases/loan/DirectorProposeRateUseCase.js";
import { ClientRespondLoanProposalUseCase } from "#application/usecases/loan/ClientRespondLoanProposalUseCase.js";
import { ListClientRepaymentsUseCase } from "#application/usecases/loan/ListClientRepaymentsUseCase.js";
import { CreateRepaymentScheduleUseCase } from "#application/usecases/loan/CreateRepaymentScheduleUseCase.js";
import { SendNotificationToClientUseCase } from "#application/usecases/notification/SendNotificationToClientUseCase.js";
import type { LoanConfigService } from "#application/ports/services/LoanConfigService.js";
import type { LoanRepaymentScheduleRepositoryInterface } from "#application/ports/repositories/LoanRepaymentScheduleRepositoryInterface.js";
import type { LoanRequestRepositoryInterface } from "#application/ports/repositories/LoanRequestRepositoryInterface.js";
import type { UserRepositoryInterface } from "#application/ports/repositories/auth/UserRepositoryInterface.js";
import type { UserRoleRepositoryInterface } from "#application/ports/repositories/auth/UserRoleRepositoryInterface.js";
import type { UuidGeneratorService } from "#application/ports/services/UuidGeneratorService.js";
import type { AccountRepositoryInterface } from "#application/ports/repositories/AccountRepositoryInterface.js";
import type { NotificationRepositoryInterface } from "#application/ports/repositories/notification/NotificationRepositoryInterface.js";
import type { NotificationService } from "#infrastructure/adapters/services/notification/NotificationService.js";
import { UserNotFoundError } from "#application/errors/UserNotFoundError.js";
import { AuthContext } from '#types/JwtPayload';
import vine from '@vinejs/vine';
import * as loanValidator from "#infrastructure/server/frameworks/adonisjs/app/validators/loan.js";

@inject()
export default class LoansController {
  constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly loanConfigService: LoanConfigService,
    private readonly loanRepaymentScheduleRepository: LoanRepaymentScheduleRepositoryInterface,
    private readonly notificationRepository: NotificationRepositoryInterface,
    private readonly notificationService: NotificationService
  ) {}

  async createLoanRequest({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const clientId = auth?.userId;
    if (!clientId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const createUseCase = new CreateLoanRequestUseCase(
      this.loanRequestRepository,
      this.userRepository,
      this.userRoleRepository,
      this.uuidService,
      this.loanConfigService,
      sendNotificationUseCase
    );

    const input = await vine.validate({schema: loanValidator.createLoanRequestValidator, data: request.body()});
    const result = await createUseCase.execute(clientId, input);
    if (result instanceof Error) {
      if (result instanceof UserNotFoundError) {
        return response.status(404).json({ error: result.message });
      }
      return response.status(500).json({ error: result.message });
    }

    return response.status(201).json(result);
  }

  async listForAdvisor({ response, auth }: HttpContext) {
    const advisorId = auth?.userId;
    if (!advisorId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const listUseCase = new ListAdvisorLoanRequestsUseCase(this.loanRequestRepository);
    const requests = await listUseCase.execute(advisorId);
    return response.status(200).json(requests);
  }

  async listForClient({ response, auth }: HttpContext) {
    const clientId = auth?.userId;
    if (!clientId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const listUseCase = new ListClientLoanRequestsUseCase(this.loanRequestRepository);
    const requests = await listUseCase.execute(clientId);
    return response.status(200).json(requests);
  }

  async listClientHistory({ request, response }: HttpContext) {
    const clientId = request.param('id');
    if (!clientId) {
      return response.status(400).json({ error: "Client id is required" });
    }

    const listUseCase = new ListClientLoanRequestsUseCase(this.loanRequestRepository);
    const requests = await listUseCase.execute(clientId);
    return response.status(200).json(requests);
  }

  async listClientRepaymentsById({ request, response }: HttpContext) {
    const clientId = request.param('id');
    if (!clientId) {
      return response.status(400).json({ error: "Client id is required" });
    }

    const useCase = new ListClientRepaymentsUseCase(this.loanRepaymentScheduleRepository);
    const schedules = await useCase.execute(clientId);
    return response.status(200).json(schedules);
  }

  async advisorDecision({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const advisorId = auth?.userId;
    if (!advisorId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const requestId = request.param('id');
    if (!requestId) {
      return response.status(400).json({ error: "Request id is required" });
    }

    const input = await vine.validate({schema: loanValidator.decideLoanRequestValidator, data: request.body()});
    const useCase = new AdvisorDecideLoanRequestUseCase(
      this.loanRequestRepository,
      sendNotificationUseCase
    );
    const result = await useCase.execute(advisorId, requestId, input.decision);

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async directorDecision({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const directorId = auth?.userId;
    if (!directorId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const requestId = request.param('id');
    if (!requestId) {
      return response.status(400).json({ error: "Request id is required" });
    }

    const director = await this.userRepository.findById(directorId);
    const directorName =
      director instanceof Error
        ? undefined
        : [director.firstName, director.lastName].filter(Boolean).join(" ").trim() ||
          director.email ||
          director.id;

    const input = await vine.validate({schema: loanValidator.decideLoanRequestValidator, data: request.body()});
    const useCase = new DirectorDecideLoanRequestUseCase(
      this.loanRequestRepository,
      this.accountRepository,
      this.loanConfigService,
      this.loanRepaymentScheduleRepository,
      new CreateRepaymentScheduleUseCase(this.loanRepaymentScheduleRepository, this.uuidService),
      sendNotificationUseCase
    );
    const result = await useCase.execute(directorId, requestId, input.decision, directorName);

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async listForDirector({ response, auth }: HttpContext) {
    const directorId = auth?.userId;
    if (!directorId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const listUseCase = new ListAdvisorApprovedRequestsUseCase(this.loanRequestRepository);
    const requests = await listUseCase.execute();
    return response.status(200).json(requests);
  }

  async directorProposeRate({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const directorId = auth?.userId;
    if (!directorId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const requestId = request.param('id');
    if (!requestId) {
      return response.status(400).json({ error: "Request id is required" });
    }

    const director = await this.userRepository.findById(directorId);
    const directorName =
      director instanceof Error
        ? undefined
        : [director.firstName, director.lastName].filter(Boolean).join(" ").trim() ||
          director.email ||
          director.id;

    const input = await vine.validate({schema: loanValidator.proposeRateValidator, data: request.body()});
    const useCase = new DirectorProposeRateUseCase(
      this.loanRequestRepository,
      sendNotificationUseCase
    );
    const result = await useCase.execute(directorId, requestId, input.rate, directorName);

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async clientRespondProposal({ request, response, auth }: HttpContext) {
    const sendNotificationUseCase = new SendNotificationToClientUseCase(
      this.notificationRepository,
      this.notificationService,
      this.uuidService,
      this.userRepository
    );

    const clientId = auth?.userId;
    if (!clientId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const requestId = request.param('id');
    if (!requestId) {
      return response.status(400).json({ error: "Request id is required" });
    }

    const input = await vine.validate({schema: loanValidator.decideLoanRequestValidator, data: request.body()});
    const accept = input.decision === "APPROVE";
    const useCase = new ClientRespondLoanProposalUseCase(
      this.loanRequestRepository,
      this.accountRepository,
      this.loanRepaymentScheduleRepository,
      new CreateRepaymentScheduleUseCase(this.loanRepaymentScheduleRepository, this.uuidService),
      sendNotificationUseCase
    );
    const result = await useCase.execute(clientId, requestId, accept);

    if (result instanceof Error) {
      return response.status(500).json({ error: result.message });
    }

    return response.status(200).json(result);
  }

  async setIndicativeRate({ request, response, auth }: HttpContext) {
    const directorId = auth?.userId;
    if (!directorId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const input = await vine.validate({schema: loanValidator.setRateValidator, data: request.body()});
    await this.loanConfigService.setIndicativeRate(input.rate);
    return response.status(200).json({ rate: input.rate });
  }

  async getIndicativeRate({ response }: HttpContext) {
    const rate = await this.loanConfigService.getIndicativeRate();
    return response.status(200).json({ rate });
  }

  async listClientRepayments({ response, auth }: HttpContext) {
    const clientId = auth?.userId;
    if (!clientId) {
      return response.status(401).json({ error: "Unauthorized" });
    }

    const useCase = new ListClientRepaymentsUseCase(this.loanRepaymentScheduleRepository);
    const schedules = await useCase.execute(clientId);
    return response.status(200).json(schedules);
  }

  async getClientInfo({ request, response }: HttpContext) {
    const clientId = request.param('id');
    if (!clientId) {
      return response.status(400).json({ error: "Client id is required" });
    }

    const user = await this.userRepository.findById(clientId);
    if (user instanceof UserNotFoundError) {
      return response.status(404).json({ error: user.message });
    }

    const accounts = await this.accountRepository.getAccountsByUserId(clientId);
    return response.status(200).json({
      user,
      accounts,
    });
  }
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    auth?: AuthContext
  }
}
