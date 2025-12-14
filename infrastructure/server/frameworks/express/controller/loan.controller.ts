import { Request, Response } from "express";
import { CreateLoanRequestUseCase } from "../../../../../application/usecases/loan/CreateLoanRequestUseCase";
import { ListAdvisorLoanRequestsUseCase } from "../../../../../application/usecases/loan/ListAdvisorLoanRequestsUseCase";
import { ListClientLoanRequestsUseCase } from "../../../../../application/usecases/loan/ListClientLoanRequestsUseCase";
import { AdvisorDecideLoanRequestUseCase } from "../../../../../application/usecases/loan/AdvisorDecideLoanRequestUseCase";
import { DirectorDecideLoanRequestUseCase } from "../../../../../application/usecases/loan/DirectorDecideLoanRequestUseCase";
import { ListAdvisorApprovedRequestsUseCase } from "../../../../../application/usecases/loan/ListAdvisorApprovedRequestsUseCase";
import { DirectorProposeRateUseCase } from "../../../../../application/usecases/loan/DirectorProposeRateUseCase";
import { ClientRespondLoanProposalUseCase } from "../../../../../application/usecases/loan/ClientRespondLoanProposalUseCase";
import { ListClientRepaymentsUseCase } from "../../../../../application/usecases/loan/ListClientRepaymentsUseCase";
import { LoanConfigRepositoryInterface } from "../../../../../application/ports/repositories/LoanConfigRepositoryInterface";
import { LoanRepaymentScheduleRepositoryInterface } from "../../../../../application/ports/repositories/LoanRepaymentScheduleRepositoryInterface";
import { CreateRepaymentScheduleUseCase } from "../../../../../application/usecases/loan/CreateRepaymentScheduleUseCase";
import { LoanRequestRepositoryInterface } from "../../../../../application/ports/repositories/LoanRequestRepositoryInterface";
import { UserRepositoryInterface } from "../../../../../application/ports/repositories/auth/UserRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../../../../application/ports/repositories/auth/UserRoleRepositoryInterface";
import { UuidGeneratorService } from "../../../../../application/ports/services/UuidGeneratorService";
import { AccountRepositoryInterface } from "../../../../../application/ports/repositories/AccountRepositoryInterface";
import { createLoanRequestSchema } from "../schemas/loan/createLoanRequestSchema";
import { decideLoanRequestSchema } from "../schemas/loan/decideLoanRequestSchema";
import { proposeRateSchema } from "../schemas/loan/proposeRateSchema";
import { setRateSchema } from "../schemas/loan/setRateSchema";
import { UserNotFoundError } from "../../../../../application/errors/UserNotFoundError";

export class LoanController {
  constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
    private readonly accountRepository: AccountRepositoryInterface,
    private readonly loanConfigRepository: LoanConfigRepositoryInterface,
    private readonly loanRepaymentScheduleRepository: LoanRepaymentScheduleRepositoryInterface,
  ) {}

  async createLoanRequest(req: Request, res: Response) {
    const clientId = req.user?.userId;
    if (!clientId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parseResult = createLoanRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.message });
    }

    const createUseCase = new CreateLoanRequestUseCase(
      this.loanRequestRepository,
      this.userRepository,
      this.userRoleRepository,
      this.uuidService,
      this.loanConfigRepository,
    );

    const result = await createUseCase.execute(clientId, parseResult.data);
    if (result instanceof Error) {
      if (result instanceof UserNotFoundError) {
        return res.status(404).json({ error: result.message });
      }
      return res.status(400).json({ error: result.message });
    }

    return res.status(201).json(result);
  }

  async listForAdvisor(req: Request, res: Response) {
    const advisorId = req.user?.userId;
    if (!advisorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const listUseCase = new ListAdvisorLoanRequestsUseCase(this.loanRequestRepository);
    const requests = await listUseCase.execute(advisorId);
    return res.status(200).json(requests);
  }

  async listForClient(req: Request, res: Response) {
    const clientId = req.user?.userId;
    if (!clientId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const listUseCase = new ListClientLoanRequestsUseCase(this.loanRequestRepository);
    const requests = await listUseCase.execute(clientId);
    return res.status(200).json(requests);
  }

  async listClientHistory(req: Request, res: Response) {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(400).json({ error: "Client id is required" });
    }

    const listUseCase = new ListClientLoanRequestsUseCase(this.loanRequestRepository);
    const requests = await listUseCase.execute(clientId);
    return res.status(200).json(requests);
  }

  async listClientRepaymentsById(req: Request, res: Response) {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(400).json({ error: "Client id is required" });
    }

    const useCase = new ListClientRepaymentsUseCase(this.loanRepaymentScheduleRepository);
    const schedules = await useCase.execute(clientId);
    return res.status(200).json(schedules);
  }

  async advisorDecision(req: Request, res: Response) {
    const advisorId = req.user?.userId;
    if (!advisorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(400).json({ error: "Request id is required" });
    }

    const parseResult = decideLoanRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.message });
    }

    const useCase = new AdvisorDecideLoanRequestUseCase(this.loanRequestRepository);
    const result = await useCase.execute(advisorId, requestId, parseResult.data.decision);

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    return res.status(200).json(result);
  }

  async directorDecision(req: Request, res: Response) {
    const directorId = req.user?.userId;
    if (!directorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(400).json({ error: "Request id is required" });
    }

    const parseResult = decideLoanRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.message });
    }

    const director = await this.userRepository.findById(directorId);
    const directorName =
      director instanceof Error
        ? undefined
        : [director.firstName, director.lastName].filter(Boolean).join(" ").trim() ||
          director.email ||
          director.id;

    const useCase = new DirectorDecideLoanRequestUseCase(
      this.loanRequestRepository,
      this.accountRepository,
      this.loanConfigRepository,
      this.loanRepaymentScheduleRepository,
      new CreateRepaymentScheduleUseCase(this.loanRepaymentScheduleRepository, this.uuidService),
    );
    const result = await useCase.execute(requestId, parseResult.data.decision, directorName);

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    return res.status(200).json(result);
  }

  async listForDirector(req: Request, res: Response) {
    const directorId = req.user?.userId;
    if (!directorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const listUseCase = new ListAdvisorApprovedRequestsUseCase(this.loanRequestRepository);
    const requests = await listUseCase.execute();
    return res.status(200).json(requests);
  }

  async directorProposeRate(req: Request, res: Response) {
    const directorId = req.user?.userId;
    if (!directorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(400).json({ error: "Request id is required" });
    }

    const parseResult = proposeRateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.message });
    }

    const director = await this.userRepository.findById(directorId);
    const directorName =
      director instanceof Error
        ? undefined
        : [director.firstName, director.lastName].filter(Boolean).join(" ").trim() ||
          director.email ||
          director.id;

    const useCase = new DirectorProposeRateUseCase(this.loanRequestRepository);
    const result = await useCase.execute(requestId, parseResult.data.rate, directorName);

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    return res.status(200).json(result);
  }

  async clientRespondProposal(req: Request, res: Response) {
    const clientId = req.user?.userId;
    if (!clientId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(400).json({ error: "Request id is required" });
    }

    const parseResult = decideLoanRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.message });
    }

    const accept = parseResult.data.decision === "approve";
    const useCase = new ClientRespondLoanProposalUseCase(
      this.loanRequestRepository,
      this.accountRepository,
      this.loanRepaymentScheduleRepository,
      new CreateRepaymentScheduleUseCase(this.loanRepaymentScheduleRepository, this.uuidService),
    );
    const result = await useCase.execute(clientId, requestId, accept);

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    return res.status(200).json(result);
  }

  async setIndicativeRate(req: Request, res: Response) {
    const directorId = req.user?.userId;
    if (!directorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parseResult = setRateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.message });
    }

    await this.loanConfigRepository.setIndicativeRate(parseResult.data.rate);
    return res.status(200).json({ rate: parseResult.data.rate });
  }

  async getIndicativeRate(req: Request, res: Response) {
    const rate = await this.loanConfigRepository.getIndicativeRate();
    return res.status(200).json({ rate });
  }

  async listClientRepayments(req: Request, res: Response) {
    const clientId = req.user?.userId;
    if (!clientId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const useCase = new ListClientRepaymentsUseCase(this.loanRepaymentScheduleRepository);
    const schedules = await useCase.execute(clientId);
    return res.status(200).json(schedules);
  }

  async getClientInfo(req: Request, res: Response) {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(400).json({ error: "Client id is required" });
    }

    const user = await this.userRepository.findById(clientId);
    if (user instanceof UserNotFoundError) {
      return res.status(404).json({ error: user.message });
    }

    const accounts = await this.accountRepository.getAccountsByUserId(clientId);
    return res.status(200).json({
      user,
      accounts,
    });
  }
}

