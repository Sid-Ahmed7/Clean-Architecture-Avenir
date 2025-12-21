import { SavingsProductEntity } from "../../../domain/entities/SavingsProductEntity";

export interface SavingsProductRepositoryInterface {
    createProduct(product: SavingsProductEntity): Promise<SavingsProductEntity | Error>;
    getProductById(id: string): Promise<SavingsProductEntity | Error>;
    getAllProducts(): Promise<SavingsProductEntity[]>;
    getActiveProducts(): Promise<SavingsProductEntity[]>;
    updateProduct(product: SavingsProductEntity): Promise<SavingsProductEntity | Error>;
    deleteProduct(id: string): Promise<boolean | Error>;
}
