"use client";

import { useEffect, useState } from "react";
import { getInterestSummary } from "@/lib/api/savingsAccount";
import { PiggyBank, TrendingUp, Calendar, Target } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import { getErrorMessage } from "@/lib/utils/error";

interface SavingsAccountCardProps {
    accountNumber: number;
}

interface InterestSummary {
    accountNumber: number;
    currentBalance: number;
    interestRate: number;
    maxDepositAmount: number | null;
    totalInterestEarned: number;
    pendingInterest: number; 
    lastInterestApplied?: Date;
    projectedAnnualInterest: number;
    isActive: boolean;
}

export function SavingsAccountCard({ accountNumber }: SavingsAccountCardProps) {
    const t = useTranslations("components.savingsAccount.card");
    const format = useFormatter();
    const [summary, setSummary] = useState<InterestSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                setLoading(true);
                const data = await getInterestSummary(accountNumber);
                setSummary(data);
            } catch (err) {
                const messsage = getErrorMessage(err as Error, t("noAccount"));
                setError(messsage);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [accountNumber]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error || !summary) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <p className="text-red-500">{t("noAccount")}</p>
            </div>
        );
    }

    const dailyInterest = summary.projectedAnnualInterest / 365;
    const effectiveBalance = summary.maxDepositAmount
        ? Math.min(summary.currentBalance, summary.maxDepositAmount)
        : summary.currentBalance;

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
            <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <PiggyBank className="w-6 h-6" />
                                <h3 className="font-bold text-xl">{t("title")}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${summary.isActive
                                    ? 'bg-green-400/90 text-green-900'
                                    : 'bg-gray-400/90 text-gray-900'
                                    }`}>
                                    {summary.isActive ? t("statusActive") : t("statusInactive")}
                                </span>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/30">
                                    {summary.interestRate}% / an
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-white/80 font-medium">{t("availableBalance")}</p>
                        <p className="text-4xl font-bold tracking-tight">
                            {format.number(summary.currentBalance, { style: 'currency', currency: 'EUR' })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-emerald-500 rounded-lg">
                                <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-xs text-gray-600 font-medium">{t("interestEarnedTotal")}</p>
                        </div>
                        <p className="text-xl font-bold text-emerald-700">
                            +{format.number(summary.totalInterestEarned, { style: 'currency', currency: 'EUR' })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Crédité</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-amber-500 rounded-lg">
                                <TrendingUp className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Intérêts en attente</p>
                        </div>
                        <p className="text-xl font-bold text-amber-700">
                            +{format.number(summary.pendingInterest, { style: 'currency', currency: 'EUR' })}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Non crédité</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <p className="text-xs text-gray-600 font-medium">{t("perDay")}</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                            +{format.number(dailyInterest, { style: 'currency', currency: 'EUR' })}
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <p className="text-xs text-gray-600 font-medium">{t("perYearProjected")}</p>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                            +{format.number(summary.projectedAnnualInterest, { style: 'currency', currency: 'EUR' })}
                        </p>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></div>
                        <h4 className="text-sm font-bold text-gray-900">{t("detailsTitle")}</h4>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-xs text-gray-500 font-medium">{t("annualInterestRate")}</p>
                            <p className="text-sm font-semibold text-gray-900">{summary.interestRate}%</p>
                        </div>
                    </div>

                    {summary.maxDepositAmount && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target className="w-4 h-4 text-gray-500" />
                                    <p className="text-xs text-gray-500 font-medium">{t("remunerationCeiling")}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {format.number(summary.maxDepositAmount, { style: 'currency', currency: 'EUR' })}
                                </p>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((effectiveBalance / summary.maxDepositAmount) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {format.number(effectiveBalance, { style: 'currency', currency: 'EUR' })} / {format.number(summary.maxDepositAmount, { style: 'currency', currency: 'EUR' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {summary.lastInterestApplied && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{t("lastInterestCalc")}</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    {format.dateTime(new Date(summary.lastInterestApplied), {
                                        dateStyle: 'long',
                                        timeStyle: 'short'
                                    })}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-800">
                        {t.rich("howItWorksMessage", {
                            strong: (chunks) => <strong>{chunks}</strong>,
                            ceiling: summary.maxDepositAmount ? t("ceilingInfo", { amount: format.number(summary.maxDepositAmount, { style: 'currency', currency: 'EUR' }) }) : ""
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}
