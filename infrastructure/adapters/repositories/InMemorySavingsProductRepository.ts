import { SavingsProductRepositoryInterface } from "../../../application/ports/repositories/SavingsProductRepositoryInterface";
import { SavingsProductEntity } from "../../../domain/entities/SavingsProductEntity";

export class InMemorySavingsProductRepository implements SavingsProductRepositoryInterface {
    
    private products: Array<SavingsProductEntity>;

    public constructor() {
        // Initialize with some default products for testing
        this.products = [
            SavingsProductEntity.create(
                "livret-a-001",
                "Livret A",
                "Livret d'épargne réglementé avec taux garanti par l'État",
                3.0,
                22950,
                10,
                true
            ),
            SavingsProductEntity.create(
                "ldds-001",
                "LDDS",
                "Livret de développement durable et solidaire",
                3.0,
                12000,
                15,
                true
            ),
            SavingsProductEntity.create(
                "pel-001",
                "PEL",
                "Plan épargne logement pour financer votre projet immobilier",
                2.25,
                61200,
                225,
                true
            )
        ];
    }

    public async createProduct(product: SavingsProductEntity): Promise<SavingsProductEntity | Error> {
        const existing = this.products.find(p => p.id === product.id);
        if (existing) {
            return new Error(`Product with ID ${product.id} already exists`);
        }

        this.products.push(product);
        return product;
    }

    public async getProductById(id: string): Promise<SavingsProductEntity | Error> {
        const product = this.products.find(p => p.id === id);
        
        if (!product) {
            return new Error(`Product with ID ${id} not found`);
        }

        return product;
    }

    public async getAllProducts(): Promise<SavingsProductEntity[]> {
        return this.products;
    }

    public async getActiveProducts(): Promise<SavingsProductEntity[]> {
        return this.products.filter(p => p.isActive);
    }

    public async updateProduct(product: SavingsProductEntity): Promise<SavingsProductEntity | Error> {
        const index = this.products.findIndex(p => p.id === product.id);
        
        if (index === -1) {
            return new Error(`Product with ID ${product.id} not found`);
        }

        this.products[index] = product;
        return product;
    }

    public async deleteProduct(id: string): Promise<boolean | Error> {
        const index = this.products.findIndex(p => p.id === id);
        
        if (index === -1) {
            return new Error(`Product with ID ${id} not found`);
        }

        this.products.splice(index, 1);
        return true;
    }
}
