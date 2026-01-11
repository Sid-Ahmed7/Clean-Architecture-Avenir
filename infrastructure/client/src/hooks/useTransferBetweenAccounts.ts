"use client";

import { apiClient } from "@/lib/api/apiClient";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { BankTransferTransaction } from "@/types/bankTransfer";
import { type TransferBetweenAccountsModel } from "@/lib/validation/transfer/transferBetweenAccountsSchema";

type TransferPayload = TransferBetweenAccountsModel;

export function useTransferBetweenAccounts() {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [transaction, setTransaction] = useState<BankTransferTransaction | null>(null);

    const transfer = useCallback((payload: TransferPayload) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        setTransaction(null);

        return apiClient
            .post<BankTransferTransaction>("/accounts/transfer", payload)
            .then((response) => {
                setSuccess(true);
                setTransaction(response.data);
            })
            .catch((err) => {
                const message = err?.response?.data?.error ?? t('generalErrors.transfer.failed');
                setError(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const resetState = useCallback(() => {
        setError(null);
        setSuccess(false);
        setTransaction(null);
    }, []);

    return {
        transfer,
        loading,
        error,
        success,
        transaction,
        resetState,
    };
}


