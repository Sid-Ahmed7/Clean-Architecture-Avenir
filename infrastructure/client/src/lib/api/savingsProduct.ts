import { apiClient } from "./apiClient";

// Savings Products
export const getAllSavingsProducts = async (activeOnly: boolean = true) => {
    const { data } = await apiClient.get(`/savings-products?activeOnly=${activeOnly}`);
    return data;
};

export const createSavingsProduct = async (productData: any) => {
    const { data } = await apiClient.post("/savings-products", productData);
    return data;
};

export const updateSavingsProduct = async (productId: string, updates: any) => {
    const { data } = await apiClient.put(`/savings-products/${productId}`, updates);
    return data;
};

export const subscribeToSavingsProduct = async (productId: string, initialDeposit?: number) => {
    const { data} = await apiClient.post("/savings-products/subscribe", { 
        productId,
        ...(initialDeposit && { initialDeposit })
    });
    return data;
};

// Get user's savings accounts
export const getMySavingsAccounts = async () => {
    const { data } = await apiClient.get("/savings-accounts");
    return data;
};
