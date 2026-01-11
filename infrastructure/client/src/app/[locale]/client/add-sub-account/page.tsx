"use client";

import SubAccountForm from "@/components/bankAccount/SubAccountForm";
import { useUserAccounts } from "@/hooks/useUserAccounts";
import { useTranslations } from "next-intl";

export default function AddSubAccountPage() {
    const t = useTranslations("pages.client.addSubAccount");
    const { accounts, loading, error } = useUserAccounts();

    const mainAccount = accounts.find(acc => acc.accountType === "CHECKING");

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            {loading ? (
                <p className="text-center py-10">{t("loading")}</p>
            ) : error ? (
                <p className="text-center py-10 text-red-500">{error}</p>
            ) : !mainAccount ? (
                <p className="text-center py-10 text-gray-500">{t("noMainAccountFound")}</p>
            ) : (
                <SubAccountForm parentAccountId={mainAccount.accountNumber} />
            )}
        </div>
    );
}
