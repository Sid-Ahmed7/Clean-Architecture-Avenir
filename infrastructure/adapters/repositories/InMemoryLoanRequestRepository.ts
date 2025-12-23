import { LoanRequestRepositoryInterface } from "../../../application/ports/repositories/LoanRequestRepositoryInterface";
import { LoanRequestEntity } from "../../../domain/entities/LoanRequestEntity";

export class InMemoryLoanRequestRepository implements LoanRequestRepositoryInterface {
  private requests: LoanRequestEntity[] = [];

  public async create(request: LoanRequestEntity) {
    this.requests.push(request);
    return request;
  }

  public async findByAdvisor(advisorId: string) {
    return this.requests.filter((req) => req.advisorId === advisorId);
  }

  public async findByClient(clientId: string) {
    return this.requests.filter((req) => req.clientId === clientId);
  }

  public async findById(id: string) {
    return this.requests.find((req) => req.id === id) ?? null;
  }

  public async findAdvisorApproved() {
    return this.requests.filter((req) => req.status === "ADVISOR_APPROVED");
  }

  public async save(request: LoanRequestEntity) {
    const idx = this.requests.findIndex((r) => r.id === request.id);
    if (idx === -1) {
      this.requests.push(request);
    } else {
      this.requests[idx] = request;
    }
    return request;
  }
}

