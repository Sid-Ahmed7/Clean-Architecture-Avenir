
export interface CreateBeneficiaryGroup {
    userId: string;
    groupName: string;
    description?: string;
    beneficiaryIds: string[];
}