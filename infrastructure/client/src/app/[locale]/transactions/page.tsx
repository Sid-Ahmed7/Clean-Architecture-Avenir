"use client";

import TransactionHistoryTable from "@/components/bankAccount/TransactionHistoryTable";
import { useTransactionHistory } from "@/lib/hooks/useTransactionHistory";

export default function TransactionsPage() {
    const { transactions, loading, error } = useTransactionHistory();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Historique des transactions</h1>
                <p className="text-gray-500">Consulte toutes les opérations exécutées depuis tes comptes.</p>
            </div>

            {loading && (
                <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                    Chargement de l'historique…
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <TransactionHistoryTable transactions={transactions} />
            )}
        </div>
    );
}

