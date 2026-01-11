import { CreateSubAccountModel } from "../validation/bankAccount/createSubAccountSchema";
import { QuickTransferRequest } from "@/types/quickTransfer";
import { apiClient } from "./apiClient";

export const getAccounts = () => {
    return apiClient.get("/accounts/my-accounts")
}

export const addSubAccount = (data: CreateSubAccountModel) => {
    return apiClient.post("/accounts/create/sub", data)
}

export const getLastTransactions = (limit: number = 10) => {
    return apiClient.get(`/accounts/transactions/last?limit=${limit}`)
}

export const quickTransfer = async (data: QuickTransferRequest) => {
    const { data: response } = await apiClient.post("/accounts/quick-transfer", data);
    return response;
}

export const updateTransferLimit = (accountNumber: number, transferLimit: number) => {
    return apiClient.put(`/accounts/${accountNumber}/transfer-limit`, { transferLimit });
}

export const requestOverdraftIncrease = (accountNumber: number, overdraftLimit: number) => {
    return apiClient.post(`/accounts/${accountNumber}/overdraft-limit/request`, { overdraftLimit });
}

export const getOverdraftRequests = () => {
    return apiClient.get("/accounts/overdraft-requests");
}

export const respondOverdraftRequest = (requestId: string, action: "APPROVE" | "REJECT") => {
    return apiClient.put(`/accounts/overdraft-requests/${requestId}/response`, { action });
}

export const getOverdraftRequestDetails = (requestId: string) => {
    return apiClient.get(`/accounts/overdraft-requests/${requestId}/details`);
}

export const getRib = (accountNumber: number) => {
    return apiClient.get(`/accounts/${accountNumber}/rib`);
}

export const createAccount = (data: { customAccountName?: string; accountType?: string; currency?: string }) => {
    return apiClient.post("/accounts", data);
}

export const renameAccount = (accountNumber: number, customAccountName: string) => {
    return apiClient.patch(`/accounts/${accountNumber}/rename`, { customAccountName });
}

export const deleteAccount = (accountNumber: number) => {
    return apiClient.delete(`/accounts/${accountNumber}`);
}