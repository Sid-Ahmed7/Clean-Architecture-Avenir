import { SavingsProductEntity } from "../../../domain/entities/SavingsProductEntity";
import { SavingsProductRepositoryInterface } from "../../ports/repositories/SavingsProductRepositoryInterface";
import { SavingsAccountRepositoryInterface } from "../../ports/repositories/SavingsAccountRepositoryInterface";
import { UpdateSavingsProductDTO } from "./dto/UpdateSavingsProductDTO";

export class UpdateSavingsProductUseCase {
    constructor(
        private savingsProductRepository: SavingsProductRepositoryInterface,
        private savingsAccountRepository: SavingsAccountRepositoryInterface
    ) {}

    public async execute(dto: UpdateSavingsProductDTO): Promise<SavingsProductEntity | Error> {
        // Get the product
        const product = await this.savingsProductRepository.getProductById(dto.productId);
        if (product instanceof Error) {
            return product;
        }

        // Update product fields
        let updatedProduct = product;

        if (dto.interestRate !== undefined) {
            updatedProduct = updatedProduct.updateInterestRate(dto.interestRate);
            
            // Update all linked savings accounts with new rate
            const allAccounts = await this.savingsAccountRepository.getAllSavingsAccounts();
            const linkedAccounts = allAccounts.filter(acc => acc.productId === dto.productId);
            
            for (const account of linkedAccounts) {
                account.updateInterestRate(dto.interestRate);
                await this.savingsAccountRepository.updateSavingsAccount(account);
            }
        }

        if (dto.maxDepositAmount !== undefined || dto.minDepositAmount !== undefined) {
            updatedProduct = updatedProduct.updateLimits(
                dto.maxDepositAmount !== undefined ? dto.maxDepositAmount : product.maxDepositAmount,
                dto.minDepositAmount !== undefined ? dto.minDepositAmount : product.minDepositAmount
            );
            
            // Update all linked savings accounts with new limits
            if (dto.maxDepositAmount !== undefined) {
                const allAccounts = await this.savingsAccountRepository.getAllSavingsAccounts();
                const linkedAccounts = allAccounts.filter(acc => acc.productId === dto.productId);
                
                for (const account of linkedAccounts) {
                    account.updateMaxDeposit(dto.maxDepositAmount);
                    await this.savingsAccountRepository.updateSavingsAccount(account);
                }
            }
        }

        if (dto.isActive !== undefined) {
            updatedProduct = updatedProduct.updateStatus(dto.isActive);
        }

        // Save updated product
        const result = await this.savingsProductRepository.updateProduct(updatedProduct);
        return result;
    }
}
