import { useState } from "react";
import { useTranslations } from "next-intl";
import { apiClient } from "../lib/api/apiClient";
import { useNotification } from "./useNotifications";
import { NotificationEnum } from "@/types/Notification";

export function useAccountManagement() {
  const t = useTranslations("client.accountSettings");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotification();

  const updateAccountName = async (accountNumber: number, customAccountName: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(`/accounts/${accountNumber}/name`, {
        customAccountName
      });

      if (response.status === 200) {
        addNotification(
          NotificationEnum.SUCCESS,
          t("updateName.success")
        );
        return { success: true, data: response.data };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || t("error");
      setError(errorMessage);
      addNotification(NotificationEnum.ALERT, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (accountNumber: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.delete(`/accounts/${accountNumber}`);

      if (response.status === 200 || response.status === 204) {
        addNotification(
          NotificationEnum.SUCCESS,
          t("deleteModal.success")
        );
        return { success: true };
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || t("error");
      setError(errorMessage);
      addNotification(NotificationEnum.ALERT, errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateAccountName,
    deleteAccount,
    loading,
    error,
  };
}
