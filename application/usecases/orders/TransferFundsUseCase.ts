import { TransferFunds } from "../../requests/TransferFunds";
import { AccountService } from "../../ports/services/AccountService";

export class TransferFundsUseCase {
    public constructor(private readonly accountService: AccountService){}

    public async execute(transferFunds: TransferFunds): Promise<void | Error> {
        const totalAmount = transferFunds.quantity * transferFunds.executionPrice;

        const buyerFeeToApply = transferFunds.buyerFeesPaid ? 0 : transferFunds.buyerFee;
        const sellerFeeToApply = transferFunds.sellerFeesPaid ? 0 : transferFunds.sellerFee;

        const totalAmountDebiteur = totalAmount + buyerFeeToApply;

        const unblockResult = await this.accountService.unblockAccountFunds(transferFunds.buyerUserId,totalAmountDebiteur);

        if (unblockResult instanceof Error) {
            return unblockResult;
        }

        const debitResult = await this.accountService.debitAccount(transferFunds.buyerUserId,totalAmountDebiteur);

        if(debitResult instanceof Error) {
            await this.accountService.blockAccountFunds(transferFunds.buyerUserId, totalAmountDebiteur);
            return debitResult;
        }

        const totalAmountCrediter = totalAmount - sellerFeeToApply;
        const creditResult = await this.accountService.creditAccount(transferFunds.sellerUserId,totalAmountCrediter);

        if(creditResult instanceof Error) {
            await this.accountService.creditAccount(transferFunds.buyerUserId, totalAmountDebiteur);
            return creditResult;
        }

    }


}