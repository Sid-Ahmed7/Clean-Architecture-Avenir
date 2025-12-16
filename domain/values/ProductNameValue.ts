export class ProductNameValue {
    private static MIN_LENGTH = 1;
    private static MAX_LENGTH = 100;

    public static from(name: string): ProductNameValue | Error {
        if (!name || name.trim().length === 0) {
            return new Error('Product name is required and cannot be empty');
        }

        const trimmedName = name.trim();

        if (trimmedName.length < this.MIN_LENGTH) {
            return new Error(`Product name must be at least ${this.MIN_LENGTH} character long`);
        }

        if (trimmedName.length > this.MAX_LENGTH) {
            return new Error(`Product name cannot exceed ${this.MAX_LENGTH} characters`);
        }

        return new ProductNameValue(trimmedName);
    }

    private constructor(public readonly value: string) {}
}
