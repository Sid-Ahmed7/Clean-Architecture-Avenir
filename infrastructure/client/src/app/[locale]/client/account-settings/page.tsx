"use client";

import { useState, useEffect } from "react";
import { Settings, CreditCard, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AccountNameForm } from "@/components/bankAccount/AccountNameForm";
import { DeleteAccountConfirmModal } from "@/components/bankAccount/DeleteAccountConfirmModal";
import { apiClient } from "@/lib/api/apiClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Account {
  accountNumber: number;
  customAccountName: string;
  iban: string;
  currentBalance: number;
  currency: string;
  accountType: string;
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const t = useTranslations("client.accountSettings");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await apiClient.get("/accounts/my-accounts");
      setAccounts(response.data);
      if (response.data.length > 0) {
        setSelectedAccount(response.data[0]);
      }
    } catch {
      setError(t("error"));
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleAccountUpdated = () => {
    fetchAccounts();
  };

  const handleAccountDeleted = () => {
    router.push("/client/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-700">{t("loading")}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && accounts.length === 0 && (
          <p className="text-gray-700">{t("noAccounts")}</p>
        )}

        {!loading && !error && accounts.length > 0 && (
          <>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("back")}
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
              <p className="text-gray-700">{t("subtitle")}</p>
            </div>
          </div>
        </div>

        {accounts.length > 1 && (
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t("selectAccount.title")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accounts.map((account) => (
                <button
                  key={account.accountNumber}
                  onClick={() => setSelectedAccount(account)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedAccount?.accountNumber === account.accountNumber
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {account.customAccountName || t("selectAccount.unnamed")}
                      </p>
                      <p className="text-sm text-gray-600">#{account.accountNumber}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {selectedAccount && (
          <>
            <Card>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t("accountInfo.title")}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{t("accountInfo.accountNumber")}:</span>
                  <span className="font-semibold text-gray-900">{selectedAccount.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{t("accountInfo.iban")}:</span>
                  <span className="font-mono text-sm text-gray-900">{selectedAccount.iban}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{t("accountInfo.type")}:</span>
                  <span className="font-semibold text-gray-900">{selectedAccount.accountType}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{t("accountInfo.balance")}:</span>
                  <span className="font-bold text-lg text-blue-600">
                    {selectedAccount.currentBalance.toFixed(2)} {selectedAccount.currency}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-gray-900 mb-4">{t("updateName.title")}</h2>
              <AccountNameForm
                accountNumber={selectedAccount.accountNumber}
                currentName={selectedAccount.customAccountName}
                onSuccess={handleAccountUpdated}
              />
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-red-600 mb-2">{t("dangerZone.title")}</h2>
              <p className="text-gray-600 mb-4">
                {t("dangerZone.description")}
              </p>
              <Button
                variant="danger"
                icon={Trash2}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                {t("dangerZone.button")}
              </Button>
            </Card>
          </>
        )}

            {selectedAccount && (
              <DeleteAccountConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                accountNumber={selectedAccount.accountNumber}
                accountName={selectedAccount.customAccountName}
                accountType={selectedAccount.accountType}
                currentBalance={selectedAccount.currentBalance}
                currency={selectedAccount.currency}
                onSuccess={handleAccountDeleted}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}