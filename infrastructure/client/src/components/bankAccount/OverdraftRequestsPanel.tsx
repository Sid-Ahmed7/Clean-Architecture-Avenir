"use client";

import { useState } from "react";
import { useOverdraftRequests } from "@/hooks/useOverdraftRequests";
import { useRespondOverdraftRequest } from "@/hooks/useRespondOverdraftRequest";
import { getOverdraftRequestDetails } from "@/lib/api/account";
import { useTranslations, useFormatter } from "next-intl";
import { getErrorMessage } from "@/lib/utils/error";

export function OverdraftRequestsPanel() {
    const t = useTranslations("components.bankAccount.overdraftRequests");
    const tEnums = useTranslations("components.enums");
    const format = useFormatter();
    const { data, loading, error, setData } = useOverdraftRequests();
    const { respond, loading: respondLoading, error: respondError } = useRespondOverdraftRequest();
    const [modalRequestId, setModalRequestId] = useState<string | null>(null);
    const [modalData, setModalData] = useState<any | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);

    const handleRespond = (id: string, action: "APPROVE" | "REJECT") => {
        respond(id, action).then((ok) => {
            if (!ok) return;

            setData((prev) => prev.filter((item) => item.id !== id));
            if (modalRequestId === id) {
                handleCloseModal();
            }
        });
    };

    const handleOpenModal = (id: string) => {
        setDetailsError(null);
        setDetailsLoading(true);
        setModalRequestId(id);
        setModalData(null);
        getOverdraftRequestDetails(id)
            .then((res) => {
                setModalData(res.data);
            })
            .catch((err) => {
                const message = getErrorMessage(err as Error, "Failed to load client profile");
                setDetailsError(message);
            })
            .finally(() => setDetailsLoading(false));
    };

    const handleCloseModal = () => {
        setModalRequestId(null);
        setModalData(null);
        setDetailsError(null);
        setDetailsLoading(false);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{t("title")}</h3>
                <span className="text-sm text-gray-500">{t("requestsCount", { count: data.length })}</span>
            </div>

            {loading && <p className="text-sm text-gray-500">{t("loading")}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            {respondError && <p className="text-sm text-red-600">{respondError}</p>}

            {!loading && data.length === 0 && <p className="text-sm text-gray-600">{t("noPendingRequests")}</p>}

            <div className="space-y-3">
                {data.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {t("account")} #{item.accountNumber.toString().padStart(11, "0")}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {t("current")} : {format.number(item.currentOverdraftLimit, { style: 'currency', currency: 'EUR' })} | {t("requested")} :{" "}
                                    {format.number(item.requestedOverdraftLimit, { style: 'currency', currency: 'EUR' })}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {t("client")}: {item.userId} • {t("status")}: {tEnums(`overdraftStatus.${item.status}`)}
                                </p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleOpenModal(item.id)}
                                    disabled={detailsLoading && modalRequestId === item.id}
                                    className="px-3 py-2 text-sm font-semibold rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                                >
                                    {detailsLoading && modalRequestId === item.id ? t("loadingProfile") : t("viewProfile")}
                                </button>
                                <button
                                    onClick={() => handleRespond(item.id, "REJECT")}
                                    disabled={respondLoading}
                                    className="px-3 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
                                >
                                    {t("reject")}
                                </button>
                                <button
                                    onClick={() => handleRespond(item.id, "APPROVE")}
                                    disabled={respondLoading}
                                    className="px-3 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                                >
                                    {t("approve")}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {modalRequestId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6 relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            aria-label={t("close")}
                        >
                            ✕
                        </button>

                        {detailsLoading && <p className="text-sm text-gray-600">{t("loadingDetails")}</p>}
                        {detailsError && <p className="text-sm text-red-600">{detailsError}</p>}

                        {modalData && (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {modalData.client.firstName} {modalData.client.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {modalData.client.email} • {modalData.client.phoneNumber ?? t("phoneNA")} • {t("status")} : {tEnums(`clientStatus.${modalData.client.status}`)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <p className="text-sm font-semibold text-gray-900 mb-2">{t("accounts")}</p>
                                        <div className="space-y-2 text-xs text-gray-700">
                                            {modalData.accounts.map((acc: any) => (
                                                <div key={acc.accountNumber} className="flex justify-between">
                                                    <span>#{acc.accountNumber.toString().padStart(11, "0")} ({acc.accountType})</span>
                                                    <span>{format.number(acc.currentBalance, { style: 'currency', currency: acc.currency })}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                                        <p className="text-sm font-semibold text-gray-900 mb-2">{t("loanRequests")}</p>
                                        <div className="space-y-2 text-xs text-gray-700">
                                            {modalData.loanRequests.length === 0 && <p>{t("noLoanRequests")}</p>}
                                            {modalData.loanRequests.map((lr: any) => (
                                                <div key={lr.id} className="flex justify-between">
                                                    <span>{lr.purpose}</span>
                                                    <span>{lr.amount} • {lr.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800">
                                    <p className="font-semibold mb-1">{t("overdraftRequestLabel")}</p>
                                    <p>{t("current")} : {format.number(modalData.request.currentOverdraftLimit, { style: 'currency', currency: 'EUR' })} • {t("requested")} : {format.number(modalData.request.requestedOverdraftLimit, { style: 'currency', currency: 'EUR' })}</p>
                                    <p>{t("status")} : {tEnums(`overdraftStatus.${modalData.request.status}`)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

