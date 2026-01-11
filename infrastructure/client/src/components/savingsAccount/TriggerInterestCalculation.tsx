"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { triggerInterestCalculation } from "@/lib/api/savingsAccount";
import { Calculator, TrendingUp, Check, X, AlertCircle } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/error";

type InterestCalculationResult = {
  message: string;
  results?: {
    accountNumber: number;
    interestCredited: number;
    newBalance: number;
    totalInterestEarned: number;
  }[];
};

export function TriggerInterestCalculation() {
    const t = useTranslations("components.savingsAccount.triggerCalculation");
    const [isCalculating, setIsCalculating] = useState(false);
    const [results, setResults] = useState<InterestCalculationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = async () => {
        try {
            setIsCalculating(true);
            setError(null);
            setResults(null);

            const data = await triggerInterestCalculation();
            setResults(data);
        } catch (err) {
            const message = getErrorMessage(err as Error, t("errorDefault"));
            setError(message);
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{t("title")}</h2>
                        <p className="text-white/80 text-sm">{t("subtitle")}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-blue-900 font-semibold mb-1">
                            {t("infoTitle")}
                        </p>
                        <p className="text-xs text-blue-800">
                            {t("infoDescription")}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-900">{t("errorTitle")}</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {results && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Check className="w-5 h-5 text-green-600" />
                            <p className="text-sm font-semibold text-green-900">
                                {results.message}
                            </p>
                        </div>

                        {results.results && results.results.length > 0 ? (
                            <div className="space-y-3 mt-4">
                                <p className="text-xs text-green-800 font-semibold">
                                    {t("accountsProcessed", { count: results.results.length })}
                                </p>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {results.results.map((result, index: number) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-lg p-3 border border-green-200"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {t("accountLabel", { number: result.accountNumber })}
                                                </p>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                                    +{result.interestCredited.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                <div>
                                                    <span className="text-gray-500">{t("newBalance")}</span>
                                                    <span className="ml-1 font-semibold">
                                                        {result.newBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">{t("totalEarned")}</span>
                                                    <span className="ml-1 font-semibold text-green-600">
                                                        {result.totalInterestEarned.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-green-100 rounded-lg p-3 mt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-green-900">
                                            {t("totalInterestCredited")}
                                        </span>
                                        <span className="text-lg font-bold text-green-700">
                                            +{results.results.reduce((sum: number, r) => sum + r.interestCredited, 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-green-800 mt-2">
                                {t("noActiveAccounts")}
                            </p>
                        )}
                    </div>
                )}

                <button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                    {isCalculating ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            {t("calculating")}
                        </>
                    ) : (
                        <>
                            <TrendingUp className="w-5 h-5" />
                            {t("calculate")}
                        </>
                    )}
                </button>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-xs text-amber-800">
                        <strong>{t("warningTitle")}</strong> {t("warningMessage")}
                    </p>
                </div>
            </div>
        </div>
    );
}
