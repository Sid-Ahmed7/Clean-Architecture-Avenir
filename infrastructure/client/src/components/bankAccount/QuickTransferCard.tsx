"use client";

import { useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { useTransferBetweenAccounts } from "@/hooks/useTransferBetweenAccounts";
import { useTranslations, useFormatter } from "next-intl";
import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { BankTransaction } from "@/types/bankTransaction";
import { quickTransfer } from "@/lib/api/account";
import { getErrorMessage } from "@/lib/utils/error";

interface QuickTransferCardProps {
    transactions: BankTransaction[];
    accounts: AccountModel[];
    onTransferSuccess?: () => void;
}

export default function QuickTransferCard({ transactions, accounts, onTransferSuccess }: QuickTransferCardProps) {
    const t = useTranslations("components.bankAccount.quickTransfer");
    const format = useFormatter();
    const { transfer, loading } = useTransferBetweenAccounts();
        const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [showConfirm, setShowConfirm] = useState(false);

    const mainAccount = accounts.find((a) => a.accountType === "CHECKING");

    const handleQuickTransfer = (transaction: BankTransaction) => {
        setSelectedTransaction(transaction);
        setAmount(transaction.amount.toString());
        setShowConfirm(true);
    };

    const handleConfirmTransfer = async () => {
        if (!selectedTransaction || !mainAccount) return;

        const isDebit = mainAccount.accountNumber === selectedTransaction.debitAccount;
        const targetAccountNumber = isDebit ? selectedTransaction.creditAccount : selectedTransaction.debitAccount;

        const targetAccount = accounts.find((a) => a.accountNumber === targetAccountNumber);

        try {
            if (targetAccount) {
                await transfer({ fromIban: mainAccount.iban, toIban: targetAccount.iban, amount: parseFloat(amount) });
            } else {
                await quickTransfer({ sourceAccountNumber: mainAccount.accountNumber, destinationAccountNumber: targetAccountNumber, amount: parseFloat(amount) });
            }

            setShowConfirm(false);
            setSelectedTransaction(null);
            setAmount("");
            onTransferSuccess?.();
        } catch (error) {
            alert(error instanceof Error ? error.message : t("error"));
        }
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setSelectedTransaction(null);
        setAmount("");
    };

    if (transactions.length === 0) {
        return (
            <section className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{t("title")}</h2>
                        <p className="text-sm text-gray-500">{t("subtitle")}</p>
                    </div>
                </div>
                <div className="text-center py-8 text-gray-500">
                    {t("noTransactions")}
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{t("title")}</h2>
                        <p className="text-sm text-gray-500">{t("subtitle")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {transactions.slice(0, 6).map((tx) => {
                        const isDebit = mainAccount && tx.debitAccount === mainAccount.accountNumber;
                        const counterpartAccountNumber = isDebit ? tx.creditAccount : tx.debitAccount;
                        const counterpartUserName = isDebit ? tx.creditUserName : tx.debitUserName;
                        const counterpartAccount = accounts.find((a) => a.accountNumber === counterpartAccountNumber);

                        const userLabel = counterpartUserName ?? t("unknownUser");
                        const accountLabel = counterpartAccount?.customAccountName
                            ? counterpartAccount.customAccountName
                            : counterpartUserName
                                ? `${userLabel}`
                                : counterpartAccountNumber
                                    ? `${t("account")} ${counterpartAccountNumber}`
                                    : t("unknownAccount");

                        return (
                            <div
                                key={tx.transactionReference}
                                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                                {accountLabel}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {format.dateTime(new Date(tx.createdAt), {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base font-bold text-gray-900">
                                                {format.number(tx.amount, { style: 'currency', currency: 'EUR' })}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleQuickTransfer(tx)}
                                        disabled={loading}
                                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 group-hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t("repeatButton")}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {showConfirm && selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("confirmTitle")}</h3>
                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">{t("amountLabel")}</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                <p className="mb-2">
                                    <span className="font-semibold">{t("toLabel")}</span>{" "}
                                    {mainAccount && selectedTransaction.debitAccount === mainAccount.accountNumber
                                        ? selectedTransaction.creditUserName ?? `${t("account")} ${selectedTransaction.creditAccount}`
                                        : selectedTransaction.debitUserName ?? `${t("account")} ${selectedTransaction.debitAccount}`}
                                </p>
                                <p className="text-xs text-gray-500">{t("originalTransaction")} {format.dateTime(new Date(selectedTransaction.createdAt), {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleConfirmTransfer}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading || !amount || parseFloat(amount) <= 0}
                            >
                                {loading ? t("processing") : t("confirmButton")}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                disabled={loading}
                            >
                                {t("cancelButton")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
