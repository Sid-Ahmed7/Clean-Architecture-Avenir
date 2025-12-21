import { useState, useEffect } from "react";
import { getLastTransactions } from "@/lib/api/account";

interface Transaction {
    transactionReference: string;
    debitAccount: number;
    creditAccount: number;
    amount: number;
    transactionType: string;
    createdAt: string;
    debitUserId?: string;
    creditUserId?: string;
    debitUserName?: string;
    creditUserName?: string;
}

export const useLastTransactions = (limit: number = 10) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getLastTransactions(limit);
                setTransactions(response.data);
            } catch (err: any) {
                setError(err.response?.data?.error || "Erreur lors de la récupération des transactions");
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [limit]);

    const refetch = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getLastTransactions(limit);
            setTransactions(response.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Erreur lors de la récupération des transactions");
        } finally {
            setLoading(false);
        }
    };

    return { transactions, loading, error, refetch };
};
