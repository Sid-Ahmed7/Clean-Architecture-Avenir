import { AccountService } from "../../ports/services/AccountService";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { InsufficientFundsError } from "../../../domain/errors/InsufficientFundsError";

export class UnblockFundsForOrderUseCase {
    public constructor(private readonly accountService: AccountService) {}

    public async execute(userId: string,quantity: number,pricePerShare: number,fee: number): Promise<void | Error> {
        const totalAmount = (quantity * pricePerShare) + fee;
        
        const result = await this.accountService.unblockAccountFunds(userId, totalAmount);
        
        if (result instanceof Error) {
            return result;
        }
    }
}