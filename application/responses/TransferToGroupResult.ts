import { TransactionEntity } from "../../domain/entities/TransactionEntity";

export interface TransferToGroupResult {
  successfulTransfers: TransactionEntity[];
}