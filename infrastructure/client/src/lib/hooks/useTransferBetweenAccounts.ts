"use client";

import { useCallback, useState } from "react";
import { apiClient } from "../api/apiClient";

type TransferPayload = {
    fromIban: string;
    toIban: string;
    amount: number;
};

export function useTransferBetweenAccounts() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const transfer = useCallback((payload: TransferPayload) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        return apiClient
            .post("/accounts/transfer", payload)
            .then(() => {
                setSuccess(true);
            })
            .catch((err) => {
                const message = err?.response?.data?.error ?? "Virement impossible";
                setError(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const resetState = useCallback(() => {
        setError(null);
        setSuccess(false);
    }, []);

    return {
        transfer,
        loading,
        error,
        success,
        resetState,
    };
}


