import { OverdraftIncreaseRequestEntity } from "../../../domain/entities/OverdraftIncreaseRequestEntity";

export interface OverdraftRequestRepositoryInterface {
    create(request: OverdraftIncreaseRequestEntity): Promise<OverdraftIncreaseRequestEntity>;
    findByUserId(userId: string): Promise<OverdraftIncreaseRequestEntity[]>;
    findAll(): Promise<OverdraftIncreaseRequestEntity[]>;
    findById(id: string): Promise<OverdraftIncreaseRequestEntity | null>;
    save(request: OverdraftIncreaseRequestEntity): Promise<OverdraftIncreaseRequestEntity>;
}

