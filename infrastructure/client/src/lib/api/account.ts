import { CreateSubAccountModel } from "../validation/bankAccount/createSubAccountSchema";
import { apiClient } from "./apiClient";


export const getAccounts = () => {
    return apiClient.get("/accounts/my-accounts")
}

export const addSubAccount = (data: CreateSubAccountModel) => {
    return apiClient.post("/accounts/create/sub", data)
}