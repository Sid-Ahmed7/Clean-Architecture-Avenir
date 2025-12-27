export enum TransferStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export enum TransactionType {
  TRANSFER = "TRANSFER",
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  PAYMENT = "PAYMENT",
  FEE = "FEE",
  INTEREST = "INTEREST"
}

export interface BankTransferTransaction {
  reference: string;
  debitAccount: number;
  creditAccount: number;
  amount: number;
  type: TransactionType;
  userId: string;
  status: TransferStatus;
  createdAt: string;
  debitUserId?: string;
  creditUserId?: string;
}
