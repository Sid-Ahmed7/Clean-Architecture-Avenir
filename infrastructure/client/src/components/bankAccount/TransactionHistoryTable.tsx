"use client";

import { TransactionModel } from "@/lib/hooks/useTransactionHistory";
import { format } from "date-fns";
import fr from "date-fns/locale/fr";

type TransactionHistoryTableProps = {
    transactions: TransactionModel[];
};

const formatDate = (value: string) =>
    format(new Date(value), "dd MMM yyyy HH:mm", { locale: fr });

export default function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
    if (transactions.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                Aucune transaction pour le moment.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Émetteur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Destinataire
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Référence
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                        <tr key={transaction.transactionReference}
                            className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {formatDate(transaction.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900">
                                        {transaction.debitUserName ?? "Utilisateur inconnu"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {transaction.debitAccount}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-900">
                                        {transaction.creditUserName ?? "Utilisateur inconnu"}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {transaction.creditAccount}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                {transaction.amount.toFixed(2)} €
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {transaction.status}
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-500 break-all">
                                {transaction.transactionReference}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

