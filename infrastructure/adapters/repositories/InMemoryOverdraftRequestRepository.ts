import { OverdraftIncreaseRequestEntity } from "../../../domain/entities/OverdraftIncreaseRequestEntity";
import { OverdraftRequestRepositoryInterface } from "../../../application/ports/repositories/OverdraftRequestRepositoryInterface";

export class InMemoryOverdraftRequestRepository implements OverdraftRequestRepositoryInterface {
    private overdraftRequests: OverdraftIncreaseRequestEntity[] = [];

    async create(request: OverdraftIncreaseRequestEntity): Promise<OverdraftIncreaseRequestEntity> {
        this.overdraftRequests.push(request);
        return request;
    }

    async findByUserId(userId: string): Promise<OverdraftIncreaseRequestEntity[]> {
        return this.overdraftRequests.filter((request) => request.userId === userId);
    }

    async findAll(): Promise<OverdraftIncreaseRequestEntity[]> {
        return [...this.overdraftRequests];
    }

    async findById(id: string): Promise<OverdraftIncreaseRequestEntity | null> {
        return this.overdraftRequests.find((request) => request.id === id) ?? null;
    }

    async save(request: OverdraftIncreaseRequestEntity): Promise<OverdraftIncreaseRequestEntity> {
        const index = this.overdraftRequests.findIndex((stored) => stored.id === request.id);
        if (index !== -1) {
            this.overdraftRequests[index] = request;
        } else {
            this.overdraftRequests.push(request);
        }
        return request;
    }
}

