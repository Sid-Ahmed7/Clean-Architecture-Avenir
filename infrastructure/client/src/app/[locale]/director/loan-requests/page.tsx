"use client";

import { useEffect, useState } from "react";
import { directorProposeRate, getDirectorLoanRequests } from "@/lib/api/loan";
import { LoanRequest } from "@/types/loan";
import { withBankManagerProtection } from "@/components/auth/withRoleProtection";

function DirectorLoanRequestsPage() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    getDirectorLoanRequests()
      .then((data) => setRequests(data))
      .catch((err) => {
        console.error("Failed to load loan requests:", err);
        setError(err.response?.data?.error || "Impossible de charger les demandes");
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePropose = (id: string) => {
    const rate = rates[id];
    if (!rate || rate <= 0) {
      setError("Veuillez saisir un taux valide");
      return;
    }
    setSubmitting(id);
    directorProposeRate(id, rate)
      .then((res) => {
        setRequests((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, status: res.data.status ?? r.status, proposedRate: res.data.proposedRate ?? rate }
              : r,
          ),
        );
      })
      .catch((err) => {
        console.error("Rate proposal error:", err);
        setError(err.response?.data?.error || "Impossible d'enregistrer le taux");
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
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Validation directeur</h1>
      <p className="text-sm text-gray-600 mb-6">
        Demandes approuvées par les conseillers, en attente de décision finale.
      </p>

      {requests.length === 0 ? (
        <div className="bg-white border rounded-lg p-4 shadow-sm">Aucune demande à valider.</div>
      ) : (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => {
                const pendingDirector = req.status === "ADVISOR_APPROVED";
                return (
                  <tr key={req.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{req.clientId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{req.advisorId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {req.amount.toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{req.purpose}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm flex gap-2 items-center">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Taux %"
                        className="w-24 px-2 py-1 border rounded"
                        value={rates[req.id] ?? ""}
                        onChange={(e) =>
                          setRates((prev) => ({ ...prev, [req.id]: Number(e.target.value) }))
                        }
                        disabled={!pendingDirector || submitting === req.id}
                      />
                      <button
                        disabled={!pendingDirector || submitting === req.id}
                        onClick={() => handlePropose(req.id)}
                        className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Proposer
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

export default withBankManagerProtection("/login")(DirectorLoanRequestsPage);

