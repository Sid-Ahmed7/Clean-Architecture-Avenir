"use client";

import { useTranslations } from "next-intl";

export default function HelpPage() {
    const t = useTranslations("client.help");

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{t("title")}</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-700">{t("inDevelopment")}</p>
            </div>
        </div>
    );
}
