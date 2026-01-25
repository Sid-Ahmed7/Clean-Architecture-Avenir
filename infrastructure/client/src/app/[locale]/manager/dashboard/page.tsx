"use client";

import { UserCog, Settings, Briefcase, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function ManagerDashboard() {
    const t = useTranslations("manager.dashboard");
    return (
        <div className="min-h-screen bg-white p-6 mx-auto space-y-8">
            <section className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{t("title")}</h2>
                    </div>
                    <p className="text-gray-700 ml-14">{t("subtitle")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <UserCog className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{t("advisorManagement.title")}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            {t("advisorManagement.description")}
                        </p>
                        <div className="space-y-2">
                            <Link href="/manager/create-advisor">
                                <Button variant="primary" fullWidth icon={UserCog} size="sm">
                                    {t("advisorManagement.createButton")}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Settings className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{t("agencySettings.title")}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            {t("agencySettings.description")}
                        </p>
                        <div className="space-y-2">
                            <Link href="/manager/agency-settings">
                                <Button variant="secondary" fullWidth icon={Settings} size="sm">
                                    {t("agencySettings.button")}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{t("groupChat.title")}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            {t("groupChat.description")}
                        </p>
                        <div className="space-y-2">
                            <Link href="/group-chat">
                                <Button variant="secondary" fullWidth icon={Users} size="sm">
                                    {t("groupChat.button")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
