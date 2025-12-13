"use client";

import { useEffect, useState, useMemo } from "react";
import { clientRespondProposal, getClientLoanRequests, getClientRepayments } from "@/lib/api/loan";
import { LoanRepaymentSchedule, LoanRequest } from "@/types/loan";
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

  const handleDecision = (id: string, decision: "approve" | "reject") => {
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
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conseiller
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mensualité
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reste à payer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prochaine échéance
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créée le
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {req.advisorName ?? req.advisorId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{req.amount.toLocaleString("fr-FR")} €</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.purpose}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {req.durationMonths ? `${req.durationMonths} mois` : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {req.appliedRate !== undefined
                      ? `${(req.appliedRate * 100).toFixed(2)}% (appliqué${req.directorName ? ` par ${req.directorName}` : ""})`
                      : req.proposedRate !== undefined
                        ? `${(req.proposedRate * 100).toFixed(2)}% (proposé${req.directorName ? ` par ${req.directorName}` : ""})`
                        : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatMonthly(req)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {(() => {
                      const sched = scheduleFor(req.id);
                      if (!sched) return "-";
                      const remaining = `${sched.remainingPrincipal.toFixed(2)} €`;
                      const remainingTerms = sched.durationMonths - sched.paymentsMade;
                      return `${remaining} (reste ${remainingTerms} échéance${remainingTerms > 1 ? "s" : ""})`;
                    })()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {(() => {
                      const sched = scheduleFor(req.id);
                      return sched ? new Date(sched.nextDueDate).toLocaleDateString("fr-FR") : "-";
                    })()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-sm flex gap-2">
                    {req.status === "RATE_PROPOSED" ? (
                      <>
                        <button
                          disabled={submitting === req.id}
                          onClick={() => handleDecision(req.id, "approve")}
                          className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Accepter
                        </button>
                        <button
                          disabled={submitting === req.id}
                          onClick={() => handleDecision(req.id, "reject")}
                          className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Refuser
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default withClientProtection("/login")(ClientLoanRequestsPage);

