"use client";

import { useTranslations } from "next-intl";

export default function AccountsPage() {
    const t = useTranslations();

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Comptes</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-700">Page des comptes bancaires - En cours de développement</p>
            </div>
        </div>
    );
}
