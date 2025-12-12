"use client";

import { useEffect, useState } from "react";
import { advisorDecideLoanRequest, getAdvisorLoanRequests } from "@/lib/api/loan";
import { LoanRequest } from "@/types/loan";
import { withBankAdvisorProtection } from "@/components/auth/withRoleProtection";

function AdvisorLoanRequestsPage() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    getAdvisorLoanRequests()
      .then((data) => setRequests(data))
      .catch((err) => {
        console.error("Failed to load loan requests:", err);
        setError(err.response?.data?.error || "Impossible de charger les demandes");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDecision = (id: string, decision: "approve" | "reject") => {
    setSubmitting(id);
    advisorDecideLoanRequest(id, decision)
      .then((res) => {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: res.data.status ?? r.status } : r)),
        );
      })
      .catch((err) => {
        console.error("Decision error:", err);
        setError(err.response?.data?.error || "Impossible d'enregistrer la décision");
      })
      .finally(() => setSubmitting(null));
  };

  if (loading) {
    return <div className="p-6">Chargement des demandes...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Demandes de crédit</h1>
      <p className="text-sm text-gray-600 mb-6">
        Voici les demandes créées par les clients et assignées à vous.
      </p>

      {requests.length === 0 ? (
        <div className="bg-white border rounded-lg p-4 shadow-sm">Aucune demande pour le moment.</div>
      ) : (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
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
                  Créée le
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => {
                const isPending = req.status === "PENDING";
                return (
                  <tr key={req.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{req.clientId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {req.amount.toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{req.purpose}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
                        {req.status}
                      </span>
                      {req.proposedRate && (
                        <span className="ml-2 text-xs text-gray-600">{req.proposedRate}%</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3 text-sm flex gap-2">
                      <button
                        disabled={!isPending || submitting === req.id}
                        onClick={() => handleDecision(req.id, "approve")}
                        className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Accepter
                      </button>
                      <button
                        disabled={!isPending || submitting === req.id}
                        onClick={() => handleDecision(req.id, "reject")}
                        className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Refuser
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default withBankAdvisorProtection("/login")(AdvisorLoanRequestsPage);

