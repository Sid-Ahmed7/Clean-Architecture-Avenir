import { Request, Response } from "express";
import { CreateLoanRequestUseCase } from "../../../../../application/usecases/loan/CreateLoanRequestUseCase";
import { ListAdvisorLoanRequestsUseCase } from "../../../../../application/usecases/loan/ListAdvisorLoanRequestsUseCase";
import { ListClientLoanRequestsUseCase } from "../../../../../application/usecases/loan/ListClientLoanRequestsUseCase";
import { AdvisorDecideLoanRequestUseCase } from "../../../../../application/usecases/loan/AdvisorDecideLoanRequestUseCase";
import { DirectorDecideLoanRequestUseCase } from "../../../../../application/usecases/loan/DirectorDecideLoanRequestUseCase";
import { ListAdvisorApprovedRequestsUseCase } from "../../../../../application/usecases/loan/ListAdvisorApprovedRequestsUseCase";
import { DirectorProposeRateUseCase } from "../../../../../application/usecases/loan/DirectorProposeRateUseCase";
import { ClientRespondLoanProposalUseCase } from "../../../../../application/usecases/loan/ClientRespondLoanProposalUseCase";
import { LoanRequestRepositoryInterface } from "../../../../../application/ports/repositories/LoanRequestRepositoryInterface";
import { UserRepositoryInterface } from "../../../../../application/ports/repositories/auth/UserRepositoryInterface";
import { UserRoleRepositoryInterface } from "../../../../../application/ports/repositories/auth/UserRoleRepositoryInterface";
import { UuidGeneratorService } from "../../../../../application/ports/services/UuidGeneratorService";
import { AccountRepositoryInterface } from "../../../../../application/ports/repositories/AccountRepositoryInterface";
import { createLoanRequestSchema } from "../schemas/loan/createLoanRequestSchema";
import { decideLoanRequestSchema } from "../schemas/loan/decideLoanRequestSchema";
import { proposeRateSchema } from "../schemas/loan/proposeRateSchema";
import { UserNotFoundError } from "../../../../../application/errors/UserNotFoundError";

export class LoanController {
  constructor(
    private readonly loanRequestRepository: LoanRequestRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface,
    private readonly userRoleRepository: UserRoleRepositoryInterface,
    private readonly uuidService: UuidGeneratorService,
    private readonly accountRepository: AccountRepositoryInterface,
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

    const useCase = new DirectorDecideLoanRequestUseCase(this.loanRequestRepository);
    const result = await useCase.execute(requestId, parseResult.data.decision);

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

    const useCase = new DirectorProposeRateUseCase(this.loanRequestRepository);
    const result = await useCase.execute(requestId, parseResult.data.rate);

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
    const useCase = new ClientRespondLoanProposalUseCase(this.loanRequestRepository, this.accountRepository);
    const result = await useCase.execute(clientId, requestId, accept);

    if (result instanceof Error) {
      return res.status(400).json({ error: result.message });
    }

    return res.status(200).json(result);
  }
}

