import { AccountRepositoryInterface } from "../../ports/repositories/AccountRepositoryInterface";
import { UserRepositoryInterface } from "../../ports/repositories/auth/UserRepositoryInterface";
import { AccountNotFoundError } from "../../errors/AccountNotFoundError";
import { UserNotFoundError } from "../../errors/UserNotFoundError";
import { InvalidAccountError } from "../../../domain/errors/InvalidAccountError";
import { RoleEnum } from "../../../domain/enums/RoleEnum";

export class GetRibUseCase {
    public constructor(
        private readonly accountRepository: AccountRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface,
        private readonly bankName: string = "Avenir Bank",
        private readonly bic: string = "AVENFRPPXXX",
    ) {}

    public async execute(
        accountNumber: number,
        requesterId: string,
        roles: RoleEnum[],
    ): Promise<
        | {
              bankName: string;
              bic: string;
              iban: string;
              accountNumber: number;
              accountNumberFormatted: string;
              holderName: string;
              holderAddress?: string;
              currency: string;
          }
        | Error
    > {
        const account = await this.accountRepository.getOneAccountByAccountNumber(accountNumber);
        if (account instanceof Error) {
            return account;
        }

        const isStaff = roles.includes(RoleEnum.BANK_MANAGER) || roles.includes(RoleEnum.BANK_ADVISOR);
        if (!isStaff && account.userId !== requesterId) {
            return new InvalidAccountError("You can only download the RIB for your own accounts");
        }

        const owner = await this.userRepository.findById(account.userId);
        if (owner instanceof Error) {
            return owner;
        }

        const holderName = [owner.firstName, owner.lastName].filter(Boolean).join(" ").trim() || owner.email;

        return {
            bankName: this.bankName,
            bic: this.bic,
            iban: account.iban,
            accountNumber: account.accountNumber,
            accountNumberFormatted: account.accountNumber.toString().padStart(11, "0"),
            holderName,
            holderAddress: owner.address,
            currency: account.currency,
        };
    }
}

