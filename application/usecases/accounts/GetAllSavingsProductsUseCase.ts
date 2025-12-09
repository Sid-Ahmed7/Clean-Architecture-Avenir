import { SavingsProductEntity } from "../../../domain/entities/SavingsProductEntity";
import { SavingsProductRepositoryInterface } from "../../ports/repositories/SavingsProductRepositoryInterface";

export class GetAllSavingsProductsUseCase {
    constructor(
        private savingsProductRepository: SavingsProductRepositoryInterface
    ) {}

    public async execute(activeOnly: boolean = true): Promise<SavingsProductEntity[]> {
        if (activeOnly) {
            return await this.savingsProductRepository.getActiveProducts();
        }
        return await this.savingsProductRepository.getAllProducts();
    }
}
