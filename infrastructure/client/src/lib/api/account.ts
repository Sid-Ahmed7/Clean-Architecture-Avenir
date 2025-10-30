import { ResponseSubAccountModel } from "../validation/bankAccount/responseSubAccountSchema";
import { apiClient } from "./apiClient";


export const getAccounts = () => {
    return apiClient.get("/accounts/my-accounts")
}

export const addSubAccount = (data: ResponseSubAccountModel) => {
    return apiClient.post("/accounts/create/sub", data)
}