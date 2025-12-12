export class ProductIdValue {
    public static from(id: string): ProductIdValue | Error {
        if (!id || id.trim().length === 0) {
            return new Error('Product ID is required and cannot be empty');
        }

        return new ProductIdValue(id);
    }

    private constructor(public readonly value: string) {}
}
