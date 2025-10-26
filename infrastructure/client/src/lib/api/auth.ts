import { apiClient } from "./apiClient";

export const getAllAdvisors = async () => {
    const {data} = await apiClient.get(`/auth/getAdvisors`);
      return Array.isArray(data) ? data : data ?? [];
}
