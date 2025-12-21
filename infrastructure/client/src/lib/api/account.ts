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