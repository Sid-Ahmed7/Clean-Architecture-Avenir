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

  useEffect(() => {
    Promise.all([getClientLoanRequests(), getClientRepayments()])
      .then(([loans, schedules]) => {
        setRequests(loans);
        setRepayments(schedules);
      })
      .catch((err) => {
        console.error("Failed to load loan requests:", err);
        setError(err.response?.data?.error || "Impossible de charger vos demandes");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Chargement de vos demandes...</div>;
  }

  const handleDecision = (id: string, decision: LoanDecision) => {
    setSubmitting(id);
    clientRespondProposal(id, decision)
      .then((res) => {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: res.data.status ?? r.status } : r)),
        );
      })
      .catch((err) => {
        console.error("Client decision error:", err);
        setError(err.response?.data?.error || "Impossible d'enregistrer la décision");
      })
      .finally(() => setSubmitting(null));
  };

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Mes demandes de crédit</h1>
      <p className="text-sm text-gray-600 mb-6">
        Historique des demandes envoyées à votre conseiller.
      </p>

      {requests.length === 0 ? (
        <div className="bg-white border rounded-lg p-4 shadow-sm">Aucune demande.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {requests.map((req) => {
            const sched = scheduleFor(req.id);
            const remainingTerms = sched ? sched.durationMonths - sched.paymentsMade : null;
            return (
              <div key={req.id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Conseiller</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {req.advisorName ?? req.advisorId}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-xs uppercase text-gray-500">Montant</p>
                    <p className="font-semibold text-gray-900">{req.amount.toLocaleString("fr-FR")} €</p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-xs uppercase text-gray-500">Durée</p>
                    <p className="font-semibold text-gray-900">
                      {req.durationMonths ? `${req.durationMonths} mois` : "-"}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50 col-span-2">
                    <p className="text-xs uppercase text-gray-500">Motif</p>
                    <p className="font-medium text-gray-900">{req.purpose}</p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-xs uppercase text-gray-500">Taux</p>
                    <p className="font-semibold text-gray-900">
                      {req.appliedRate !== undefined
                        ? `${(req.appliedRate * 100).toFixed(2)}%${req.directorName ? ` (par ${req.directorName})` : ""}`
                        : req.proposedRate !== undefined
                          ? `${(req.proposedRate * 100).toFixed(2)}%${req.directorName ? ` (proposé par ${req.directorName})` : ""}`
                          : "-"}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-xs uppercase text-gray-500">Mensualité</p>
                    <p className="font-semibold text-gray-900">{formatMonthly(req)}</p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-xs uppercase text-gray-500">Reste à payer</p>
                    <p className="font-semibold text-gray-900">
                      {sched
                        ? `${sched.remainingPrincipal.toFixed(2)} €${remainingTerms !== null ? ` (${remainingTerms} échéance${remainingTerms > 1 ? "s" : ""})` : ""}`
                        : "-"}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-xs uppercase text-gray-500">Prochaine échéance</p>
                    <p className="font-semibold text-gray-900">
                      {sched ? new Date(sched.nextDueDate).toLocaleDateString("fr-FR") : "-"}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-xs uppercase text-gray-500">Créée le</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {req.status === "RATE_PROPOSED" ? (
                  <div className="flex gap-2">
                    <button
                      disabled={submitting === req.id}
                      onClick={() => handleDecision(req.id, "APPROVE")}
                      className="px-3 py-2 rounded bg-green-600 text-white text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Accepter le taux
                    </button>
                    <button
                      disabled={submitting === req.id}
                      onClick={() => handleDecision(req.id, "REJECT")}
                      className="px-3 py-2 rounded bg-red-600 text-white text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
}

export default withClientProtection("/login")(ClientLoanRequestsPage);

