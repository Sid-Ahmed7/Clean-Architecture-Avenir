import { InvalidIbanError } from "../../../domain/errors/InvalidIbanError";

export interface IbanGeneratorService {
    generateIban(accountNumber: number): Promise<string | InvalidIbanError>; 
}