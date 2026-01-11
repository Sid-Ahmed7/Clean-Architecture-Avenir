"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AlertTriangle, X } from "lucide-react";
import { useAccountManagement } from "@/hooks/useAccountManagement";

interface DeleteAccountConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountNumber: number;
  accountName: string;
  accountType: string;
  currentBalance: number;
  currency: string;
  onSuccess?: () => void;
}

export function DeleteAccountConfirmModal({isOpen,onClose,accountNumber,accountName,accountType,currentBalance,currency,onSuccess}: DeleteAccountConfirmModalProps) {
  const t = useTranslations("client.accountSettings.deleteModal");
  const [confirmText, setConfirmText] = useState("");
  const { deleteAccount, loading } = useAccountManagement();
  const CONFIRM_TEXT = String(accountNumber);

  const isCheckingAccount = accountType === "CHECKING";
  const hasBalance = currentBalance > 0;

  const handleDelete = async () => {
    if (confirmText !== CONFIRM_TEXT) {
      return;
    }

    const result = await deleteAccount(accountNumber);

    if (result?.success) {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 border-b border-red-100 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{t("title")}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {isCheckingAccount ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-amber-800 font-bold mb-2">
                {t("checkingAccountWarning")}
              </p>
              <p className="text-amber-700 text-sm">
                {t("checkingAccountDescription")}
              </p>
            </div>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800 font-medium">
                  {t("warning")}
                </p>
                <p className="text-red-700 text-sm mt-2">
                  {t("description")}{" "}
                  <span className="font-bold">{accountName || `#${accountNumber}`}</span>.
                </p>
              </div>

              {hasBalance && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 font-medium mb-1">
                    {t("balanceTransferInfo")}
                  </p>
                  <p className="text-blue-700 text-sm">
                    {t("balanceTransferDescription", {
                      amount: currentBalance.toFixed(2),
                      currency: currency
                    })}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-700 font-medium mb-2">
                  {t("confirmLabel")} <span className="font-bold text-red-600">{CONFIRM_TEXT}</span> :
                </p>
                <Input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={CONFIRM_TEXT}
                  variant="outlined"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            fullWidth
            disabled={loading}
          >
            {isCheckingAccount ? t("understood") : t("cancel")}
          </Button>
          {!isCheckingAccount && (
            <Button
              type="button"
              onClick={handleDelete}
              variant="danger"
              fullWidth
              loading={loading}
              disabled={confirmText !== CONFIRM_TEXT || loading}
            >
              {t("confirm")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}