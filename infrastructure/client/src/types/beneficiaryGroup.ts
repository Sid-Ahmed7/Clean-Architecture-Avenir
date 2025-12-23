export interface BeneficiaryGroup {
  groupId: string;
  userId: string;
  groupName: string;
  beneficiaryIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBeneficiaryGroupRequest {
  groupName: string;
  beneficiaryIds?: string[];
}

export interface AddBeneficiaryToGroupRequest {
  beneficiaryId: string;
}

export interface UpdateBeneficiaryGroupRequest {
  groupName?: string;
  beneficiaryIds?: string[];
}

export interface TransferDataGroup {
  groupId: string;
  sourceAccountNumber: number;
  totalAmount: number;
  
}