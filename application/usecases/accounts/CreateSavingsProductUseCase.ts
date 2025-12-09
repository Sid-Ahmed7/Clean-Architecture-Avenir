import { SavingsProductEntity } from "../../../domain/entities/SavingsProductEntity";
import { SavingsProductRepositoryInterface } from "../../ports/repositories/SavingsProductRepositoryInterface";
import { CreateSavingsProductDTO } from "./dto/CreateSavingsProductDTO";
import { UuidGeneratorService } from "../../ports/services/UuidGeneratorService";

export class CreateSavingsProductUseCase {
    constructor(
        private savingsProductRepository: SavingsProductRepositoryInterface,
        private uuidService: UuidGeneratorService
    ) {}

    public async execute(dto: CreateSavingsProductDTO): Promise<SavingsProductEntity | Error> {
        const productId = this.uuidService.generate();

        const product = SavingsProductEntity.create(
            productId,
            dto.name,
            dto.description,
            dto.interestRate,
            dto.maxDepositAmount,
            dto.minDepositAmount,
            true // isActive by default
        );

        const result = await this.savingsProductRepository.createProduct(product);
        return result;
    }
}
