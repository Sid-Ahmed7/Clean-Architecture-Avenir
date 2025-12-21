import { CreateBeneficiaryRequest, UpdateBeneficiaryRequest } from "@/types/beneficiary";
import { apiClient } from "./apiClient";
import { TransferToBeneficiaryRequest } from "@/types/transfer";

export const createBeneficiary = async (beneficiary: CreateBeneficiaryRequest) => {
    const { data } = await apiClient.post("/beneficiaries", beneficiary);
    return data;
}
export const getBeneficiaries = async () => {
  const { data } = await apiClient.get("/beneficiaries");
  return Array.isArray(data) ? data : [];
};

export const updateBeneficiary = async (beneficiaryId: string, beneficiary: UpdateBeneficiaryRequest) => {

  const { data } = await apiClient.put(`/beneficiaries/${beneficiaryId}`, beneficiary);
  return data;
};

export const deleteBeneficiary = async (beneficiaryId: string) => {
  const { data } = await apiClient.delete(`/beneficiaries/${beneficiaryId}`);
  return data;
};

export const transferToBeneficiary = async (payload: TransferToBeneficiaryRequest
) => {
  const { data } = await apiClient.post("/beneficiaries/transfer",payload);
  return data;
};