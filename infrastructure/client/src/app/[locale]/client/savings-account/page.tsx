"use client";

import { SavingsAccountCard, PageHeader, SavingsInfoSection } from "@/components/savingsAccount";
import { useTranslations } from "next-intl";

export default function SavingsAccountPage() {
    const t = useTranslations("pages.client.savingsAccount");
    const accountNumber = 123456;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <PageHeader
                    title={t("title")}
                    subtitle={t("subtitle")}
                />

                <SavingsAccountCard accountNumber={accountNumber} />

                <SavingsInfoSection />
            </div>
        </div>
    );
}
