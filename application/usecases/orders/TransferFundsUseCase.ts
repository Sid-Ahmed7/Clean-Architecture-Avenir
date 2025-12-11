import { TransferFunds } from "../../requests/TransferFunds";
import { AccountService } from "../../ports/services/AccountService";

export class TransferFundsUseCase {
    public constructor(private accountService: AccountService){}

    public async execute(transferFunds: TransferFunds): Promise<void | Error> {
        const totalAmount = transferFunds.quantity * transferFunds.executionPrice;
        const totalAmountDebiteur = totalAmount + transferFunds.buyerFee;

        const unblockResult = await this.accountService.unblockAccountFunds(
            transferFunds.buyerUserId,
            totalAmountDebiteur
        );

        if (unblockResult instanceof Error) {
            return unblockResult;
        }

        const debitResult = await this.accountService.debitAccount(
            transferFunds.buyerUserId,
            totalAmountDebiteur
        );

        if(debitResult instanceof Error) {
            await this.accountService.blockAccountFunds(transferFunds.buyerUserId, totalAmountDebiteur);
            return debitResult;
        }

        const totalAmountCrediter = totalAmount - transferFunds.sellerFee;
        const creditResult = await this.accountService.creditAccount(
            transferFunds.sellerUserId,
            totalAmountCrediter
        );

        if(creditResult instanceof Error) {
            await this.accountService.creditAccount(transferFunds.buyerUserId, totalAmountDebiteur);
            return creditResult;
        }

    }


}