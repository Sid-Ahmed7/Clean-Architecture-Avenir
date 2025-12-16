import { AccountService } from "../../ports/services/AccountService";

export class BlockFundsForOrderUseCase {
    public constructor(private readonly accountService: AccountService) {}

    public async execute(userId: string,quantity: number,pricePerShare: number,fee: number): Promise<void | Error> {
        const totalAmount = (quantity * pricePerShare) + fee;
        
        const result = await this.accountService.blockAccountFunds(userId, totalAmount);
        
        if (result instanceof Error) {
            return result;
        }
    }
}