import { OverdraftIncreaseRequestEntity } from "../../../domain/entities/OverdraftIncreaseRequestEntity";
import { OverdraftRequestRepositoryInterface } from "../../../application/ports/repositories/OverdraftRequestRepositoryInterface";

export class InMemoryOverdraftRequestRepository implements OverdraftRequestRepositoryInterface {
    private items: OverdraftIncreaseRequestEntity[] = [];

    async create(request: OverdraftIncreaseRequestEntity): Promise<OverdraftIncreaseRequestEntity> {
        this.items.push(request);
        return request;
    }

    async findByUserId(userId: string): Promise<OverdraftIncreaseRequestEntity[]> {
        return this.items.filter((item) => item.userId === userId);
    }

    async findAll(): Promise<OverdraftIncreaseRequestEntity[]> {
        return [...this.items];
    }

    async findById(id: string): Promise<OverdraftIncreaseRequestEntity | null> {
        return this.items.find((item) => item.id === id) ?? null;
    }

    async save(request: OverdraftIncreaseRequestEntity): Promise<OverdraftIncreaseRequestEntity> {
        const index = this.items.findIndex((item) => item.id === request.id);
        if (index !== -1) {
            this.items[index] = request;
        } else {
            this.items.push(request);
        }
        return request;
    }
}

