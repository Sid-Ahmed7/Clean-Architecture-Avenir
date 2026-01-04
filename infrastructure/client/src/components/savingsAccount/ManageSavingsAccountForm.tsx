"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSavingsAccountSchema, UpdateSavingsAccountInput } from "@/lib/validation/savingsAccount/updateSavingsAccountSchema";
import { getSavingsAccount, updateSavingsAccountConfig } from "@/lib/api/savingsAccount";
import { Input } from "@/components/ui/Input";
import { Percent, DollarSign, Check, X, Settings, ToggleLeft, ToggleRight } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";

interface ManageSavingsAccountFormProps {
    accountNumber: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ManageSavingsAccountForm({ accountNumber, onSuccess, onCancel }: ManageSavingsAccountFormProps) {
    const t = useTranslations("components.savingsAccount.manageForm");
    const format = useFormatter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [currentData, setCurrentData] = useState<any>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<UpdateSavingsAccountInput>({
        resolver: zodResolver(updateSavingsAccountSchema),
        defaultValues: {
            accountNumber
        }
    });

    const isActive = watch("isActive");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getSavingsAccount(accountNumber);
                setCurrentData(data);
                setValue("interestRate", data.interestRate);
                setValue("maxDepositAmount", data.maxDepositAmount);
                setValue("isActive", data.isActive);
            } catch (err) {
                setError(t("errorTitle"));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accountNumber, setValue]);

    const onSubmit = async (data: UpdateSavingsAccountInput) => {
        try {
            setIsSubmitting(true);
            setError(null);

            await updateSavingsAccountConfig(accountNumber, data);

            setSuccess(true);

            setTimeout(() => {
                setSuccess(false);
                onSuccess?.();
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || t("errorTitle"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("successTitle")}</h3>
                    <p className="text-gray-600">{t("successMessage")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{t("title")}</h2>
                        <p className="text-white/80 text-sm">{t("subtitle", { accountNumber })}</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-900">{t("errorTitle")}</p>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Current Values Display */}
                {currentData && (
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-blue-100 space-y-2">
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                            {t("currentValuesTitle")}
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-gray-500 text-xs mb-1">{t("currentRate")}</p>
                                <p className="font-bold text-gray-900 text-lg">{currentData.interestRate}%</p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-gray-500 text-xs mb-1">{t("currentCeiling")}</p>
                                <p className="font-bold text-gray-900 text-lg">
                                    {currentData.maxDepositAmount
                                        ? format.number(currentData.maxDepositAmount, { style: 'currency', currency: 'EUR' })
                                        : t("none")}
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-gray-500 text-xs mb-1">{t("currentStatus")}</p>
                                <p className="font-bold text-gray-900">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${currentData.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {currentData.isActive ? `● ${t("active")}` : `○ ${t("inactive")}`}
                                    </span>
                                </p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                                <p className="text-gray-500 text-xs mb-1">{t("interestEarned")}</p>
                                <p className="font-bold text-emerald-600 text-lg">
                                    +{format.number(currentData.totalInterestEarned, { style: 'currency', currency: 'EUR' })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interest Rate */}
                <Input
                    label={t("newInterestRateLabel")}
                    type="number"
                    step="0.01"
                    icon={Percent}
                    variant="gradient"
                    placeholder={t("newInterestRatePlaceholder")}
                    error={errors.interestRate?.message}
                    {...register("interestRate", { valueAsNumber: true })}
                />

                {/* Max Deposit Amount */}
                <Input
                    label={t("newMaxDepositAmountLabel")}
                    type="number"
                    step="0.01"
                    icon={DollarSign}
                    variant="gradient"
                    placeholder={t("newMaxDepositAmountPlaceholder")}
                    helperText={t("newMaxDepositAmountHelper")}
                    error={errors.maxDepositAmount?.message}
                    {...register("maxDepositAmount", {
                        setValueAs: (v) => v === "" ? null : parseFloat(v)
                    })}
                />

                {/* Active Status Toggle */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {t("statusLabel")}
                    </label>
                    <button
                        type="button"
                        onClick={() => setValue("isActive", !isActive)}
                        className={`flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all duration-300 ${isActive
                            ? 'border-green-400 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md'
                            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {isActive ? (
                                <ToggleRight className="w-10 h-10 text-green-600" />
                            ) : (
                                <ToggleLeft className="w-10 h-10 text-gray-400" />
                            )}
                            <div className="text-left">
                                <p className={`font-bold text-lg ${isActive ? 'text-green-900' : 'text-gray-700'}`}>
                                    {isActive ? t("statusActive") : t("statusInactive")}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {isActive
                                        ? t("statusActiveDesc")
                                        : t("statusInactiveDesc")}
                                </p>
                            </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${isActive
                            ? 'bg-green-500 text-white shadow-lg'
                            : 'bg-gray-300 text-gray-600'
                            }`}>
                            {isActive ? t("statusOn") : t("statusOff")}
                        </span>
                    </button>
                </div>

                {/* Warning Box */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-xs text-amber-800">
                        <strong>⚠️ {t("warningTitle")} :</strong> {t("warningMessage")}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {t("cancel")}
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {t("submitting")}
                            </span>
                        ) : (
                            t("submit")
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
