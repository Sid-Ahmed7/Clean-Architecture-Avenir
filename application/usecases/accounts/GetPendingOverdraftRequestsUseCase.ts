import { OverdraftRequestRepositoryInterface } from "../../ports/repositories/OverdraftRequestRepositoryInterface";
import { OverdraftRequestStatusEnum } from "../../../domain/enums/OverdraftRequestStatusEnum";

export class GetPendingOverdraftRequestsUseCase {
    public constructor(private readonly overdraftRequestRepository: OverdraftRequestRepositoryInterface) {}

    public async execute() {
        const all = await this.overdraftRequestRepository.findAll();
        return all.filter((item) => item.status === OverdraftRequestStatusEnum.PENDING);
    }
}

