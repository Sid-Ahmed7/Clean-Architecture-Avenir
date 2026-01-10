"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FileText, Briefcase, MessageCircle, Newspaper, ArrowRight } from "lucide-react";

export default function AdvisorDashboard() {
    const t = useTranslations("advisor.dashboard");

    const colorVariants = {
        green: {
            bg: "bg-green-100",
            icon: "text-green-600",
            button: "bg-green-600 hover:bg-green-700"
        },
        purple: {
            bg: "bg-purple-100",
            icon: "text-purple-600",
            button: "bg-purple-600 hover:bg-purple-700"
        },
        blue: {
            bg: "bg-blue-100",
            icon: "text-blue-600",
            button: "bg-blue-600 hover:bg-blue-700"
        },
        orange: {
            bg: "bg-orange-100",
            icon: "text-orange-600",
            button: "bg-orange-600 hover:bg-orange-700"
        }
    };

    const cards = [
        {
            title: t("loanRequests.title"),
            description: t("loanRequests.description"),
            icon: FileText,
            variant: "green" as const,
            href: "/advisor/loan-requests",
            buttonText: t("loanRequests.button")
        },
        {
            title: t("overdraftRequests.title"),
            description: t("overdraftRequests.description"),
            icon: Briefcase,
            variant: "purple" as const,
            href: "/advisor/overdraft-requests",
            buttonText: t("overdraftRequests.button")
        },
        {
            title: t("pendingConversations.title"),
            description: t("pendingConversations.description"),
            icon: MessageCircle,
            variant: "blue" as const,
            href: "/advisor/pending-conversations",
            buttonText: t("pendingConversations.button")
        },
        {
            title: t("manageFeeds.title"),
            description: t("manageFeeds.description"),
            icon: Newspaper,
            variant: "orange" as const,
            href: "/feed/manage",
            buttonText: t("manageFeeds.button")
        },
        {
            title: t("createNews.title"),
            description: t("createNews.description"),
            icon: Newspaper,
            variant: "orange" as const,
            href: "/feed/create",
            buttonText: t("createNews.button")
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
                    <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, index) => {
                        const colors = colorVariants[card.variant];
                        const Icon = card.icon;

                        return (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colors.bg}`}>
                                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h2>
                                <p className="text-gray-600 mb-8 flex-grow">{card.description}</p>

                                <Link href={card.href} className="w-full mt-auto">
                                    <button className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-white transition-all transform active:scale-95 ${colors.button} shadow-md`}>
                                        {card.buttonText}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
