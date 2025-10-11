import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { AccountNumberValue } from "../../../domain/values/AccountNumberValue";

export interface AccountNumberGeneratorService {
    generateAccountNumber(): Promise<number | InvalidAccountError>
}