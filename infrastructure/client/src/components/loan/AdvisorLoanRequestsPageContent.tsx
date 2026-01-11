"use client";

import { useEffect, useMemo, useState } from "react";
import {
  advisorDecideLoanRequest,
  getAdvisorLoanRequests,
  getClientInfo,
  getClientLoanHistory,
  getClientRepaymentsFor,
} from "@/lib/api/loan";
import { LoanDecision, LoanRepaymentSchedule, LoanRequest, ClientDetails } from "@/types/loan";
import AdvisorLoanRequestCard from "@/components/loan/AdvisorLoanRequestCard";
import ClientProfileModal from "@/components/loan/ClientProfileModal";
import { useTranslations } from "next-intl";

export function AdvisorLoanRequestsPageContent() {
  const t = useTranslations("components.loan.advisorPage");
  const tErrors = useTranslations("generalErrors.loanRequests");
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [clientDetails, setClientDetails] = useState<Record<string, ClientDetails>>({});
  const [clientHistories, setClientHistories] = useState<Record<string, LoanRequest[]>>({});
  const [clientRepayments, setClientRepayments] = useState<Record<string, LoanRepaymentSchedule[]>>({});
  const [profileClientId, setProfileClientId] = useState<string | null>(null);

  useEffect(() => {
    getAdvisorLoanRequests()
      .then((data) => setRequests(data))
      .catch((err) => {
        setError(err.response?.data?.error || t("errorLoad"));
      })
      .finally(() => setLoading(false));
  }, [t]);

  const handleDecision = (id: string, decision: LoanDecision) => {
    setSubmitting(id);
    advisorDecideLoanRequest(id, decision)
      .then((res) => {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: res.data.status ?? r.status } : r)),
        );
      })
      .catch((err) => {
        setError(err.response?.data?.error || tErrors("saveDecisionError"));
      })
      .finally(() => setSubmitting(null));
  };

  const loadClientInfo = (clientId: string) => {
    if (clientDetails[clientId] && clientHistories[clientId] && clientRepayments[clientId]) {
      setProfileClientId(clientId);
      return;
    }
    Promise.all([getClientInfo(clientId), getClientLoanHistory(clientId), getClientRepaymentsFor(clientId)])
      .then(([info, history, repayments]) => {
        setClientDetails((prev) => ({ ...prev, [clientId]: info }));
        setClientHistories((prev) => ({ ...prev, [clientId]: history }));
        setClientRepayments((prev) => ({ ...prev, [clientId]: repayments }));
        setProfileClientId(clientId);
      })
      .catch((err) => {
        setError(err.response?.data?.error || tErrors("loadClientError"));
      });
  };

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "PENDING").length;
    const approved = requests.filter((r) => r.status?.includes("APPROVED")).length;
    const rejected = requests.filter((r) => r.status === "REJECTED").length;
    return { total, pending, approved, rejected };
  }, [requests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">{t("advisorLabel")}</p>
            <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
          </div>
          <p className="text-sm text-slate-600">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-slate-500">{t("stats.total")}</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl border bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-white/80">{t("stats.pending")}</p>
            <p className="text-2xl font-semibold">{stats.pending}</p>
          </div>
          <div className="rounded-2xl border bg-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-slate-500">{t("stats.approved")}</p>
            <p className="text-2xl font-semibold text-emerald-700">{stats.approved}</p>
          </div>
          <div className="rounded-2xl border bg-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-slate-500">{t("stats.rejected")}</p>
            <p className="text-2xl font-semibold text-rose-600">{stats.rejected}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 text-rose-700 px-4 py-3">
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border bg-white shadow-sm px-6 py-10 text-center">
            <p className="text-lg font-semibold text-slate-900">{t("noRequests")}</p>
            <p className="text-sm text-slate-600 mt-1">
              {t("noRequestsDescription")}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {requests.map((req) => (
              <AdvisorLoanRequestCard
                key={req.id}
                request={req}
                submittingId={submitting}
                onDecision={handleDecision}
                onViewProfile={loadClientInfo}
              />
            ))}
          </div>
        )}
      </div>

      {profileClientId && clientDetails[profileClientId] && (
        <ClientProfileModal
          clientId={profileClientId}
          details={clientDetails[profileClientId]}
          history={clientHistories[profileClientId] ?? []}
          repayments={(clientRepayments[profileClientId] ?? []) as LoanRepaymentSchedule[]}
          onClose={() => setProfileClientId(null)}
        />
      )}
    </div>
  );
}

export default AdvisorLoanRequestsPageContent;

