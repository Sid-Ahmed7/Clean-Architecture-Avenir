import { ProcessRepaymentsUseCase } from "../../../../../application/usecases/loan/ProcessRepaymentsUseCase";
import {
  accountRepository,
  loanRepaymentScheduleRepository,
  transactionRepository,
} from "../../../../adapters/config/repositories";
import { uuidService } from "../../../../adapters/config/services";

export function processRepaymentsUseCaseFactory() {
  return new ProcessRepaymentsUseCase(
    loanRepaymentScheduleRepository,
    accountRepository,
    transactionRepository,
    uuidService,
  );
}

