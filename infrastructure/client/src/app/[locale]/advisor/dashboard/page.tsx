"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function AdvisorDashboard() {
    const t = useTranslations("advisor.dashboard");
    return (
        <div className="min-h-screen bg-white p-6 mx-auto space-y-8">
            {/* Welcome message */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
            </div>

            {/* Advisor specific content */}
            <section className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("clientManagement.title")}</h2>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-gray-700">{t("clientManagement.description")}</p>
                    <Link href="/clients">
                        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            {t("clientManagement.button")}
                        </button>
                    </Link>
                </div>
            </section>

            <section className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("loanRequests.title")}</h2>
                <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-3">
                    <p className="text-gray-700">{t("loanRequests.description")}</p>
                    <Link href="/advisor/loan-requests">
                        <button className="w-fit bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                            {t("loanRequests.button")}
                        </button>
                    </Link>
                </div>
            </section>

            <section className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("overdraftRequests.title")}</h2>
                <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-3">
                    <p className="text-gray-700">{t("overdraftRequests.description")}</p>
                    <Link href="/advisor/overdraft-requests">
                        <button className="w-fit bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                            {t("overdraftRequests.button")}
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
