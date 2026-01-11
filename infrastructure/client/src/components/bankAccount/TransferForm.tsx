"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useFormatter } from "next-intl";
import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { TransferModel, transferSchema } from "@/lib/validation/bankAccount/transferSchema";
import { useTransferBetweenAccounts } from "@/hooks/useTransferBetweenAccounts";

type TransferFormProps = {
    accounts: AccountModel[];
    onSuccess?: () => void;
};



export default function TransferForm({ accounts, onSuccess }: TransferFormProps) {
    const t = useTranslations("client.transfers.form");
    const format = useFormatter();
    const { transfer, loading, error, success, transaction, resetState } = useTransferBetweenAccounts();
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingTransfer, setPendingTransfer] = useState<TransferModel | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<TransferModel>({
        resolver: zodResolver(transferSchema(t)),
        defaultValues: {
            fromIban: accounts.length > 0 ? accounts[0].iban : "",
            toIban: "",
            amount: 0,
        },
    });

    const selectedIban = watch("fromIban");
    const selectedToIban = watch("toIban");

    useEffect(() => {
        if (success) {
            reset({
                fromIban: accounts.length > 0 ? accounts[0].iban : "",
                toIban: "",
                amount: 0,
            });
            onSuccess?.();
        }
    }, [success, reset, accounts, onSuccess]);

    useEffect(() => {
        return () => {
            resetState();
        };
    }, [resetState]);

    const onSubmit = (data: TransferModel) => {
        setPendingTransfer(data);
        setShowConfirm(true);
    };

    const handleAccountSelect = (iban: string) => {
        setValue("fromIban", iban, { shouldValidate: true });
    };

    const handleDestinationAccountSelect = (iban: string) => {
        setValue("toIban", iban, { shouldValidate: true });
    };

    const handleConfirm = () => {
        if (!pendingTransfer) {
            return;
        }

        transfer({
            fromIban: pendingTransfer.fromIban,
            toIban: pendingTransfer.toIban,
            amount: pendingTransfer.amount,
        }).finally(() => {
            setShowConfirm(false);
            setPendingTransfer(null);
        });
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setPendingTransfer(null);
    };

    return (
        <div className="max-w-4xl w-full bg-white/80 backdrop-blur rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-7 flex flex-col gap-1">
                <p className="text-xs uppercase tracking-[0.2em] text-white/80">{t("title")}</p>
                <h2 className="text-2xl font-bold text-white">{t("subtitle")}</h2>
                <p className="text-sm text-white/80">
                    {t("description")}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-900">
                                {t("fromAccount")}
                            </label>
                            <span className="text-xs text-gray-500">{t("selectDebit")}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {accounts.map((account) => (
                                <button
                                    key={account.accountNumber}
                                    type="button"
                                    onClick={() => handleAccountSelect(account.iban)}
                                    className={`rounded-2xl border p-4 text-left transition-all shadow-sm ${selectedIban === account.iban
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {account.customAccountName || `${t("account")} ${account.accountNumber}`}
                                            </p>
                                            <p className="text-xs text-gray-500">{account.iban}</p>
                                        </div>
                                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                            {account.currency}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-lg font-semibold text-gray-900">
                                        {format.number(account.currentBalance, { style: 'currency', currency: account.currency })}
                                    </p>
                                </button>
                            ))}
                        </div>
                        <input type="hidden" value={selectedIban} {...register("fromIban")} />
                        {errors.fromIban && (
                            <p className="text-red-500 text-sm mt-1">{errors.fromIban.message}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-900">
                                {t("toAccount")}
                            </label>
                            <span className="text-xs text-gray-500">{t("selectCredit")}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {accounts
                                .filter((account) => account.iban !== selectedIban)
                                .map((account) => (
                                    <button
                                        key={account.accountNumber}
                                        type="button"
                                        onClick={() => handleDestinationAccountSelect(account.iban)}
                                        className={`rounded-2xl border p-4 text-left transition-all shadow-sm ${selectedToIban === account.iban
                                                ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {account.customAccountName || `${t("account")} ${account.accountNumber}`}
                                                </p>
                                                <p className="text-xs text-gray-500">{account.iban}</p>
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                {account.currency}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-lg font-semibold text-gray-900">
                                            {format.number(account.currentBalance, { style: 'currency', currency: account.currency })}
                                        </p>
                                    </button>
                                ))}
                        </div>
                        <input type="hidden" value={selectedToIban} {...register("toIban")} />
                        {errors.toIban && (
                            <p className="text-red-500 text-sm mt-1">{errors.toIban.message}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">{t("amount")}</label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.01"
                            {...register("amount", { valueAsNumber: true })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                            placeholder="0.00"
                        />
                        <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 text-sm font-semibold">
                            EUR
                        </span>
                    </div>
                    {errors.amount && (
                        <p className="text-red-500 text-sm">{errors.amount.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2 text-xs text-gray-500 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <p className="font-medium text-blue-900">ℹ️ {t("infoTitle")}</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>{t("info1")}</li>
                        <li>{t("info2")}</li>
                        <li>{t("info3")}</li>
                    </ul>
                </div>

                {accounts.length < 2 && (
                    <div className="flex flex-col gap-2 text-sm bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <p className="font-semibold text-yellow-900">⚠️ {t("warningTitle")}</p>
                        <p className="text-yellow-700">
                            {t("warningMessage")}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <div className="flex gap-3 flex-wrap">
                        <button
                            type="submit"
                            disabled={loading || accounts.length < 2}
                            className="flex-1 min-w-[180px] px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {loading ? t("processing") : accounts.length < 2 ? t("minAccountsRequired") : t("send")}
                        </button>
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            {t("reset")}
                        </button>
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {success && transaction && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {t("successMessage")}
                            </div>
                            <div className="text-sm text-emerald-700 space-y-1 bg-white/50 rounded-lg p-3">
                                <p className="flex justify-between">
                                    <span className="font-medium">{t("reference")}:</span>
                                    <span className="font-mono">{transaction.reference}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium">{t("amount")}:</span>
                                    <span className="font-semibold">{format.number(transaction.amount, { style: 'currency', currency: 'EUR' })}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium">{t("status")}:</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'COMPLETED'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {transaction.status === 'COMPLETED' ? t("completed") : t("pending")}
                                    </span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium">{t("date")}:</span>
                                    <span>{format.dateTime(new Date(transaction.createdAt), {
                                        dateStyle: 'medium',
                                        timeStyle: 'medium',
                                    })}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </form>

            {showConfirm && pendingTransfer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("confirmTitle")}</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {t("confirmMessage")}
                            <span className="font-semibold text-gray-900"> {format.number(pendingTransfer.amount, { style: 'currency', currency: 'EUR' })} </span>
                            {t("from")}
                            <span className="font-semibold text-gray-900"> {pendingTransfer.fromIban} </span>
                            {t("to")}
                            <span className="font-semibold text-gray-900"> {pendingTransfer.toIban}</span>.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                disabled={loading}
                            >
                                {t("confirmButton")}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                disabled={loading}
                            >
                                {t("cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


