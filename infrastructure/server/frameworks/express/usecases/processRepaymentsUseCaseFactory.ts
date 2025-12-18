import { ProcessRepaymentsUseCase } from "../../../../../application/usecases/loan/ProcessRepaymentsUseCase";
import {
  accountRepository,
  loanRepaymentScheduleRepository,
  transactionRepository,
  uuidService,
} from "../../../../adapters/config/repositories";

export function processRepaymentsUseCaseFactory() {
  return new ProcessRepaymentsUseCase(
    loanRepaymentScheduleRepository,
    accountRepository,
    transactionRepository,
    uuidService,
  );
}

