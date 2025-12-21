export interface TransferBetweenAccountsRequest {
  fromIban: string;
  toIban: string;
  amount: number;
}

export interface TransferToBeneficiaryRequest {
  beneficiaryId: string;
  sourceAccountNumber: number;
  amount: number;
}

export interface TransferToGroupRequest {
  groupId: string;
  sourceAccountNumber: number;
  amountPerBeneficiary: number;
}

export interface TransferResponse {
  reference: string;
  debitAccount: number;
  creditAccount: number;
  amount: number;
  type: string;
  userId: string;
  status: string;
  createdAt: string;
}

export interface GroupTransferResponse {
  transfers: TransferResponse[];
  totalAmount: number;
  successCount: number;
  failedCount: number;
}
