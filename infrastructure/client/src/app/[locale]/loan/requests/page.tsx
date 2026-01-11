"use client";

import { useEffect, useState, useMemo } from "react";
import { clientRespondProposal, getClientLoanRequests, getClientRepayments } from "@/lib/api/loan";
import { LoanDecision, LoanRepaymentSchedule, LoanRequest } from "@/types/loan";
import { withClientProtection } from "@/components/auth/withRoleProtection";
import { useTranslations } from "next-intl";

function ClientLoanRequestsPage() {
  const t = useTranslations("pages.loan.requests");
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [repayments, setRepayments] = useState<LoanRepaymentSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => ["PENDING", "ADVISOR_APPROVED", "RATE_PROPOSED"].includes(r.status)).length;
    const approved = requests.filter((r) => ["DIRECTOR_APPROVED", "APPROVED"].includes(r.status)).length;
    const rejected = requests.filter((r) => r.status === "REJECTED").length;
    return { total, pending, approved, rejected };
  }, [requests]);

  useEffect(() => {
    Promise.all([getClientLoanRequests(), getClientRepayments()])
      .then(([loans, schedules]) => {
        setRequests(loans);
        setRepayments(schedules);
      })
      .catch((err) => {
        setError(err.response?.data?.error || t("loadError"));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDecision = (id: string, decision: LoanDecision) => {
    setSubmitting(id);
    clientRespondProposal(id, decision)
      .then((res) => {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: res.data.status ?? r.status } : r)),
        );
      })
      .catch((err) => {
        setError(err.response?.data?.error || t("decisionError"));
      })
      .finally(() => setSubmitting(null));
  };

  const formatMonthly = (req: LoanRequest) => {
    if (req.monthlyPayment !== undefined) return t("monthlyAmount", { amount: req.monthlyPayment.toFixed(2) });
    if (req.proposedRate !== undefined && req.durationMonths && req.durationMonths > 0) {
      const total = req.amount * (1 + req.proposedRate * (req.durationMonths / 12));
      const monthly = total / req.durationMonths;
      return t("monthlyAmountProposed", { amount: monthly.toFixed(2) });
    }
    return "--";
  };

  const scheduleFor = (loanId: string) => repayments.find((s) => s.loanRequestId === loanId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">{t("clientLabel")}</p>
            <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
          </div>
          <p className="text-sm text-slate-600">{t("subtitle")}</p>
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
          <div className="rounded-xl border border-rose-100 bg-rose-50 text-rose-700 px-4 py-3">{error}</div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border bg-white shadow-sm px-6 py-10 text-center">
            <p className="text-lg font-semibold text-slate-900">{t("noRequests")}</p>
            <p className="text-sm text-slate-600 mt-1">{t("noRequestsSubtitle")}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {requests.map((req) => {
              const sched = scheduleFor(req.id);
              const remainingTerms = sched ? sched.durationMonths - sched.paymentsMade : null;
              const statusStyle =
                {
                  PENDING: "bg-amber-50 text-amber-800 border border-amber-200",
                  ADVISOR_APPROVED: "bg-blue-50 text-blue-700 border border-blue-200",
                  RATE_PROPOSED: "bg-indigo-50 text-indigo-700 border border-indigo-200",
                  DIRECTOR_APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                  APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                  REJECTED: "bg-rose-50 text-rose-700 border border-rose-200",
                }[req.status] || "bg-slate-50 text-slate-700 border border-slate-200";
              const duration = req.durationMonths ? t("durationMonths", { months: req.durationMonths }) : "—";
              const rate =
                req.appliedRate !== undefined
                  ? `${(req.appliedRate * 100).toFixed(2)}%${req.directorName ? ` (${t("byDirector", { name: req.directorName })})` : ""}`
                  : req.proposedRate !== undefined
                    ? `${(req.proposedRate * 100).toFixed(2)}%${req.directorName ? ` (${t("proposedByDirector", { name: req.directorName })})` : ""}`
                    : "—";

              return (
                <div key={req.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500">{t("advisor")}</p>
                      <p className="text-lg font-semibold text-slate-900">{req.advisorName ?? req.advisorId}</p>
                      <p className="text-xs text-slate-500">{t("createdOn", { date: new Date(req.createdAt).toLocaleDateString("fr-FR") })}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>{t(`status.${req.status}`)}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">{t("amount")}</p>
                      <p className="font-semibold text-slate-900">{req.amount.toLocaleString("fr-FR")} €</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">{t("duration")}</p>
                      <p className="font-semibold text-slate-900">{duration}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">{t("rate")}</p>
                      <p className="font-semibold text-slate-900">{rate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">{t("monthly")}</p>
                      <p className="font-semibold text-slate-900">{formatMonthly(req)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">{t("remainingToPay")}</p>
                      <p className="font-semibold text-slate-900">
                        {sched
                          ? t("remainingAmount", {
                              amount: sched.remainingPrincipal.toFixed(2),
                              installments: remainingTerms !== null ? ` (${remainingTerms} ${t("installments", { count: remainingTerms })})` : ""
                            })
                          : "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">{t("nextDueDate")}</p>
                      <p className="font-semibold text-slate-900">
                        {sched ? new Date(sched.nextDueDate).toLocaleDateString("fr-FR") : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100">
                    <p className="text-xs uppercase text-slate-500 mb-1">{t("purpose")}</p>
                    <p className="font-medium text-slate-900 leading-relaxed">{req.purpose}</p>
                  </div>

                  {req.status === "RATE_PROPOSED" ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        disabled={submitting === req.id}
                        onClick={() => handleDecision(req.id, "APPROVE")}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                      >
                        {t("acceptRate")}
                      </button>
                      <button
                        disabled={submitting === req.id}
                        onClick={() => handleDecision(req.id, "REJECT")}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                      >
                        {t("reject")}
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default withClientProtection("/login")(ClientLoanRequestsPage);

