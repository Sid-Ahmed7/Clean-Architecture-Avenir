import { UuidGeneratorInterface } from "../../../application/ports/services/UuidGeneratorService";

export class CryptoUuidGenerator implements UuidGeneratorInterface {
    public generate(): string {
        return crypto.randomUUID();
    }
}