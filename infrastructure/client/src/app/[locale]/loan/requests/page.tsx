"use client";

import { useEffect, useState, useMemo } from "react";
import { clientRespondProposal, getClientLoanRequests, getClientRepayments } from "@/lib/api/loan";
import { LoanDecision, LoanRepaymentSchedule, LoanRequest } from "@/types/loan";
import { withClientProtection } from "@/components/auth/withRoleProtection";

function ClientLoanRequestsPage() {
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
        setError(err.response?.data?.error || "Impossible de charger vos demandes");
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
        setError(err.response?.data?.error || "Impossible d'enregistrer la décision");
      })
      .finally(() => setSubmitting(null));
  };

  const formatMonthly = (req: LoanRequest) => {
    if (req.monthlyPayment !== undefined) return `${req.monthlyPayment.toFixed(2)} €/mois`;
    if (req.proposedRate !== undefined && req.durationMonths && req.durationMonths > 0) {
      const total = req.amount * (1 + req.proposedRate * (req.durationMonths / 12));
      const monthly = total / req.durationMonths;
      return `${monthly.toFixed(2)} €/mois (proposé)`;
    }
    return "--";
  };

  const scheduleFor = (loanId: string) => repayments.find((s) => s.loanRequestId === loanId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Client</p>
            <h1 className="text-3xl font-bold text-slate-900">Mes demandes de crédit</h1>
          </div>
          <p className="text-sm text-slate-600">Suivez vos demandes, les propositions de taux et l’état de vos remboursements.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-slate-500">Total</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl border bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-white/80">En cours</p>
            <p className="text-2xl font-semibold">{stats.pending}</p>
          </div>
          <div className="rounded-2xl border bg-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-slate-500">Validées</p>
            <p className="text-2xl font-semibold text-emerald-700">{stats.approved}</p>
          </div>
          <div className="rounded-2xl border bg-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-slate-500">Refusées</p>
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
            <p className="text-lg font-semibold text-slate-900">Aucune demande pour l’instant</p>
            <p className="text-sm text-slate-600 mt-1">Vos prochaines demandes apparaîtront ici.</p>
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
              const duration = req.durationMonths ? `${req.durationMonths} mois` : "—";
              const rate =
                req.appliedRate !== undefined
                  ? `${(req.appliedRate * 100).toFixed(2)}%${req.directorName ? ` (par ${req.directorName})` : ""}`
                  : req.proposedRate !== undefined
                    ? `${(req.proposedRate * 100).toFixed(2)}%${req.directorName ? ` (proposé par ${req.directorName})` : ""}`
                    : "—";

              return (
                <div key={req.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500">Conseiller</p>
                      <p className="text-lg font-semibold text-slate-900">{req.advisorName ?? req.advisorId}</p>
                      <p className="text-xs text-slate-500">Créée le {new Date(req.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>{req.status}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">Montant</p>
                      <p className="font-semibold text-slate-900">{req.amount.toLocaleString("fr-FR")} €</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">Durée</p>
                      <p className="font-semibold text-slate-900">{duration}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">Taux</p>
                      <p className="font-semibold text-slate-900">{rate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">Mensualité</p>
                      <p className="font-semibold text-slate-900">{formatMonthly(req)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">Reste à payer</p>
                      <p className="font-semibold text-slate-900">
                        {sched
                          ? `${sched.remainingPrincipal.toFixed(2)} €${
                              remainingTerms !== null ? ` (${remainingTerms} échéance${remainingTerms > 1 ? "s" : ""})` : ""
                            }`
                          : "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500">Prochaine échéance</p>
                      <p className="font-semibold text-slate-900">
                        {sched ? new Date(sched.nextDueDate).toLocaleDateString("fr-FR") : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100">
                    <p className="text-xs uppercase text-slate-500 mb-1">Motif</p>
                    <p className="font-medium text-slate-900 leading-relaxed">{req.purpose}</p>
                  </div>

                  {req.status === "RATE_PROPOSED" ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        disabled={submitting === req.id}
                        onClick={() => handleDecision(req.id, "APPROVE")}
                        className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                      >
                        Accepter le taux
                      </button>
                      <button
                        disabled={submitting === req.id}
                        onClick={() => handleDecision(req.id, "REJECT")}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                      >
                        Refuser
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

