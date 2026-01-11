"use client";

import { apiClient } from "@/lib/api/apiClient";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
    transactionHistoryArraySchema,
    type TransactionHistoryModel
} from "@/lib/validation/transfer/transactionHistorySchema";

export type TransactionModel = TransactionHistoryModel;

export const useTransactionHistory = () => {
    const t = useTranslations();
    const [transactions, setTransactions] = useState<TransactionModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        apiClient
            .get("/accounts/transactions/history")
            .then((res) => {
                const validatedData = transactionHistoryArraySchema.parse(res.data);
                setTransactions(validatedData);
            })
            .catch((err) => {
                const message = err?.response?.data?.error ?? t('generalErrors.transactionHistory.load');
                setError(message);
            })
            .finally(() => setLoading(false));
    }, []);

    return { transactions, loading, error };
};

