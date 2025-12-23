import { SavingsProductEntity } from "../../../domain/entities/SavingsProductEntity";
import { SavingsProductRepositoryInterface } from "../../ports/repositories/SavingsProductRepositoryInterface";
import { CreateSavingsProduct } from "../../requests/CreateSavingsProduct";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";

export class CreateSavingsProductUseCase {
    constructor(
        private readonly savingsProductRepository: SavingsProductRepositoryInterface,
        private readonly uuidService: UuidGeneratorService
    ) {}

    public async execute(dto: CreateSavingsProduct): Promise<SavingsProductEntity | Error> {
        const productId = this.uuidService.generate();

        const product = SavingsProductEntity.create(
            productId,
            dto.name,
            dto.description,
            dto.interestRate,
            dto.maxDepositAmount,
            dto.minDepositAmount,
            true 
        );

        if (product instanceof Error) {
            return product;
        }

        const result = await this.savingsProductRepository.createProduct(product);
        
        if (result instanceof Error) {
            return result;
        }
        
        return result;
    }
}
