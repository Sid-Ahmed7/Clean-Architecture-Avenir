import { UuidGeneratorService } from "../../../application/ports/services/UuidGeneratorService";

export class CryptoUuidGenerator implements UuidGeneratorService {
    public generate(): string {
        return crypto.randomUUID();
    }
}