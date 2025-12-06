"use client";

import { apiClient } from "@/lib/api/apiClient";
import { useEffect, useState } from "react";

export type TransactionModel = {
    debitAccount: number;
    creditAccount: number;
    amount: number;
    transactionType: string;
    status: string;
    transactionReference: string;
    executedBy: string;
    createdAt: string;
    debitUserName?: string;
    creditUserName?: string;
};

export const useTransactionHistory = () => {
    const [transactions, setTransactions] = useState<TransactionModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        apiClient
            .get("/accounts/transactions/history")
            .then((res) => {
                setTransactions(res.data);
            })
            .catch((err) => {
                const message = err?.response?.data?.error ?? "Impossible de charger l'historique";
                setError(message);
            })
            .finally(() => setLoading(false));
    }, []);

    return { transactions, loading, error };
};

