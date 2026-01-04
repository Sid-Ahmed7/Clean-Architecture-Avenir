"use client";

import { TransactionModel } from "@/hooks/useTransactionHistory";
import { formatDate } from "@/lib/utils/date";
import { useTranslations } from "next-intl";

type TransactionHistoryTableProps = {
    transactions: TransactionModel[];
};


export default function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
    const t = useTranslations("components.bankAccount.transactionHistory");
    
    if (transactions.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/60 backdrop-blur p-8 text-center text-gray-500 shadow-sm">
                {t("noTransactions")}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {transactions.map((transaction) => (
                <div
                    key={transaction.transactionReference}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                                {t("reference")} : {transaction.transactionReference}
                            </p>
                            <p className="text-sm font-semibold text-gray-900">{transaction.transactionType}</p>
                            <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                        </div>
                        <div className="text-right">
                            {(() => {
                                const debitTypes = ["PAYMENT", "WITHDRAWAL", "TRANSFER", "FEE"];
                                const isDebit = debitTypes.includes(transaction.transactionType);
                                const sign = isDebit ? "-" : "+";
                                const color = isDebit ? "text-rose-600" : "text-emerald-600";
                                return (
                                    <p className={`text-lg font-bold ${color}`}>
                                        {sign}
                                        {transaction.amount.toFixed(2)} €
                                    </p>
                                );
                            })()}
                            <p className="text-xs text-gray-500">
                                {transaction.debitUserName ?? t("unknownUser")} →{" "}
                                {transaction.creditUserName ?? t("unknownUser")}
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">{t("sender")}</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {transaction.debitUserName ?? t("unknownUser")}
                            </p>
                            <p className="text-xs text-gray-500">{transaction.debitAccount}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">{t("recipient")}</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {transaction.creditUserName ?? t("unknownUser")}
                            </p>
                            <p className="text-xs text-gray-500">{transaction.creditAccount}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

