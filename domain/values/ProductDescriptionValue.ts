export class ProductDescriptionValue {
    private static MAX_LENGTH = 500;

    public static from(description: string): ProductDescriptionValue | Error {
        // Description can be empty but not null/undefined
        if (description === null || description === undefined) {
            return new Error('Product description cannot be null or undefined');
        }

        const trimmedDescription = description.trim();

        if (trimmedDescription.length > this.MAX_LENGTH) {
            return new Error(`Product description cannot exceed ${this.MAX_LENGTH} characters`);
        }

        return new ProductDescriptionValue(trimmedDescription);
    }

    private constructor(public readonly value: string) {}
}
