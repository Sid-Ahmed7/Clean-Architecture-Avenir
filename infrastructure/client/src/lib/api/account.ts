import { CreateSubAccountModel } from "../validation/bankAccount/createSubAccountSchema";
import { apiClient } from "./apiClient";


export const getAccounts = () => {
    return apiClient.get("/accounts/my-accounts")
}

export const addSubAccount = (data: CreateSubAccountModel) => {
    return apiClient.post("/accounts/create/sub", data)
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