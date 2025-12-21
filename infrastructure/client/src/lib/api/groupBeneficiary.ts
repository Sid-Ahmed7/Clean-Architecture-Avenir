import { CreateBeneficiaryGroupRequest, UpdateBeneficiaryGroupRequest } from "@/types/beneficiaryGroup";
import { apiClient } from "./apiClient";
import { TransferToGroupRequest } from "@/types/transfer";



export const createBeneficiaryGroup = async (beneficiaries: CreateBeneficiaryGroupRequest) => {
  const { data } = await apiClient.post("/beneficiary-groups",beneficiaries);
  return data;
};


export const getBeneficiaryGroups = async () => {
  const { data } = await apiClient.get("/beneficiary-groups");
  return Array.isArray(data) ? data : [];
};

export const addBeneficiaryToGroup = async (groupId: string,beneficiaryId: string) => {
  const { data } = await apiClient.post(`/beneficiary-groups/${groupId}/beneficiaries`,{ beneficiaryId });
  return data;
};

export const removeBeneficiaryFromGroup = async (groupId: string,beneficiaryId: string) => {
  const { data } = await apiClient.delete(`/beneficiary-groups/${groupId}/beneficiaries/${beneficiaryId}`);
  return data;
};
export const deleteBeneficiaryGroup = async (groupId: string) => {
  const { data } = await apiClient.delete(`/beneficiary-groups/${groupId}`);
  return data;
};

export const updateBeneficiaryGroup = async (groupId: string, updates: UpdateBeneficiaryGroupRequest) => {
  const { data } = await apiClient.put(`/beneficiary-groups/${groupId}`, updates);
  return data;
};

export const transferToGroup = async (groupId: string,payload: TransferToGroupRequest) => {
  const { data } = await apiClient.post(`/beneficiary-groups/${groupId}/transfer`,payload);
  return data;
};
