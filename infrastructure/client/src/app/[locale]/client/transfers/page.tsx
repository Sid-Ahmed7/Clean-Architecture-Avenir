"use client";

import TransferForm from "@/components/bankAccount/TransferForm";
import { withClientProtection } from "@/components/auth/withRoleProtection";
import { useUserAccounts } from "@/hooks/useUserAccounts";
import { useTranslations } from "next-intl";

function TransfersPage() {
    const { accounts, loading, error } = useUserAccounts();
    const t = useTranslations("client.transfers");

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">{t("loading")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (accounts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow p-6 text-center space-y-3">
                    <p className="text-gray-900 font-semibold">{t("noAccounts")}</p>
                    <p className="text-gray-500 text-sm">{t("createAccount")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <TransferForm accounts={accounts} />
        </div>
    );
}

export default withClientProtection("/login")(TransfersPage);
