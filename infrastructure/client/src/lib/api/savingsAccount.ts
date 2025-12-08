import { apiClient } from "./apiClient";
import { CreateSavingsAccountInput } from "../validation/savingsAccount/createSavingsAccountSchema";
import { UpdateSavingsAccountInput } from "../validation/savingsAccount/updateSavingsAccountSchema";

export const createSavingsAccount = async (data: CreateSavingsAccountInput) => {
    const response = await apiClient.post("/savings-accounts", data);
    return response.data;
};

export const getSavingsAccount = async (accountNumber: number) => {
    const response = await apiClient.get(`/savings-accounts/${accountNumber}`);
    return response.data;
};

export const updateSavingsAccountConfig = async (accountNumber: number, data: Partial<UpdateSavingsAccountInput>) => {
    const response = await apiClient.put(`/savings-accounts/${accountNumber}`, data);
    return response.data;
};

export const updateInterestRate = async (accountNumber: number, interestRate: number) => {
    const response = await apiClient.put(`/savings-accounts/${accountNumber}/interest-rate`, { interestRate });
    return response.data;
};

export const updateMaxDeposit = async (accountNumber: number, maxDepositAmount: number | null) => {
    const response = await apiClient.put(`/savings-accounts/${accountNumber}/max-deposit`, { maxDepositAmount });
    return response.data;
};

export const getInterestSummary = async (accountNumber: number) => {
    const response = await apiClient.get(`/savings-accounts/${accountNumber}/interest-summary`);
    return response.data;
};

export const triggerInterestCalculation = async () => {
    const response = await apiClient.post("/savings-accounts/calculate-interest");
    return response.data;
};
