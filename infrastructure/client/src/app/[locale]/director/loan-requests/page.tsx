"use client";

import React, { useEffect, useState } from "react";
import {
  directorProposeRate,
  directorDecideLoanRequest,
  getDirectorLoanRequests,
  setIndicativeRate,
  getIndicativeRate,
  getClientInfo,
  getClientLoanHistory,
  getClientRepaymentsFor,
} from "@/lib/api/loan";
import { LoanDecision, LoanRequest } from "@/types/loan";
import { withBankManagerProtection } from "@/components/auth/withRoleProtection";

function DirectorLoanRequestsPage() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [indicativeRate, setIndicativeRateState] = useState<number | null>(null);
  const [savingRate, setSavingRate] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "needsRate" | "ready">("all");
  const [clientDetails, setClientDetails] = useState<Record<string, any>>({});
  const [clientHistories, setClientHistories] = useState<Record<string, any[]>>({});
  const [clientRepayments, setClientRepayments] = useState<Record<string, any[]>>({});
  const [profileClientId, setProfileClientId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getDirectorLoanRequests(), getIndicativeRate()])
      .then(([data, rate]) => {
        setRequests(data);
        setIndicativeRateState(rate);
      })
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

  const handleDecision = (id: string, decision: LoanDecision) => {
    setSubmitting(id);
    directorDecideLoanRequest(id, decision)
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
        console.error("Failed to load client info:", err);
        setError(err.response?.data?.error || "Impossible de charger le profil client");
      });
  };

  const handleSaveIndicativeRate = () => {
    if (indicativeRate === null || indicativeRate <= 0) {
      setError("Veuillez saisir un taux indicatif valide");
      return;
    }
    setSavingRate(true);
    setIndicativeRate(indicativeRate)
      .catch((err) => {
        console.error("Indicative rate error:", err);
        setError(err.response?.data?.error || "Impossible d'enregistrer le taux indicatif");
      })
      .finally(() => setSavingRate(false));
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

      <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Taux indicatif &lt;= 5000€</h2>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="0.01"
            className="w-32 px-3 py-2 border rounded"
            value={indicativeRate ?? ""}
            onChange={(e) => setIndicativeRateState(Number(e.target.value))}
          />
          <button
            disabled={savingRate}
            onClick={handleSaveIndicativeRate}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sauvegarder
          </button>
          {indicativeRate !== null && (
            <span className="text-sm text-gray-700">Actuel : {indicativeRate}%</span>
          )}
        </div>
      </div>

      <div className="mb-4 flex gap-3 items-center">
        <span className="text-sm text-gray-700">Filtrer :</span>
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded border ${filter === "all" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800"}`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1 rounded border ${filter === "pending" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800"}`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilter("needsRate")}
          className={`px-3 py-1 rounded border ${filter === "needsRate" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800"}`}
        >
           5000€ (taux)
        </button>
        <button
          onClick={() => setFilter("ready")}
          className={`px-3 py-1 rounded border ${filter === "ready" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-800"}`}
        >
          ≤ 5000€ (valider)
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border rounded-lg p-4 shadow-sm">Aucune demande à valider.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {requests
            .filter((req) => {
              if (filter === "pending") return req.status === "ADVISOR_APPROVED";
              if (filter === "needsRate") return req.amount > 5000 && req.status === "ADVISOR_APPROVED";
              if (filter === "ready") return req.amount <= 5000 && req.status === "ADVISOR_APPROVED";
              return true;
            })
            .map((req) => {
              const pendingDirector = req.status === "ADVISOR_APPROVED";
              const needsRate = req.amount > 5000;
              return (
                <div key={req.id} className="bg-white border rounded-lg shadow-sm p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase text-gray-500">Client</p>
                      <p className="text-sm font-semibold text-gray-900">{req.clientName ?? req.clientId}</p>
                      <p className="text-xs text-gray-500">Conseiller : {req.advisorName ?? req.advisorId}</p>
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
                      <p className="text-xs uppercase text-gray-500">Taux</p>
                      <p className="font-semibold text-gray-900">
                        {req.proposedRate ? `${req.proposedRate}%` : needsRate ? "À proposer" : "—"}
                      </p>
                    </div>
                    <div className="p-3 rounded-md bg-gray-50 col-span-2">
                      <p className="text-xs uppercase text-gray-500">Motif</p>
                      <p className="font-medium text-gray-900">{req.purpose}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {needsRate ? (
                      <>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Taux %"
                          className="w-24 px-2 py-2 border rounded text-sm"
                          value={rates[req.id] ?? ""}
                          onChange={(e) => setRates((prev) => ({ ...prev, [req.id]: Number(e.target.value) }))}
                          disabled={!pendingDirector || submitting === req.id}
                        />
                        <button
                          disabled={!pendingDirector || submitting === req.id}
                          onClick={() => handlePropose(req.id)}
                          className="px-3 py-2 rounded bg-blue-600 text-white text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Proposer
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          disabled={!pendingDirector || submitting === req.id}
                          onClick={() => handleDecision(req.id, "APPROVE")}
                          className="px-3 py-2 rounded bg-green-600 text-white text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Valider
                        </button>
                        <button
                          disabled={!pendingDirector || submitting === req.id}
                          onClick={() => handleDecision(req.id, "REJECT")}
                          className="px-3 py-2 rounded bg-red-600 text-white text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Refuser
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => loadClientInfo(req.clientId)}
                      className="px-3 py-2 rounded bg-gray-200 text-gray-800 text-sm w-full"
                    >
                      Voir profil
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {profileClientId && clientDetails[profileClientId] && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs uppercase text-gray-400">Fiche client</p>
                <h3 className="text-lg font-semibold text-gray-900">
                  {`${clientDetails[profileClientId].user?.firstName ?? ""} ${clientDetails[profileClientId].user?.lastName ?? ""}`.trim() ||
                    clientDetails[profileClientId].user?.email ||
                    profileClientId}
                </h3>
              </div>
              <button
                onClick={() => setProfileClientId(null)}
                className="text-gray-500 hover:text-gray-700 text-lg"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <p className="text-xs uppercase text-gray-500 mb-1">Identité</p>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">Email :</span>{" "}
                  {clientDetails[profileClientId].user?.email ?? "—"}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <p className="text-xs uppercase text-gray-500 mb-2">Comptes</p>
                <div className="space-y-2">
                  {(clientDetails[profileClientId].accounts ?? []).map((acc: any) => (
                    <div
                      key={acc.accountNumber}
                      className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 bg-white"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {acc.accountType} — {acc.accountNumber}
                        </p>
                        <p className="text-xs text-gray-600">IBAN : {acc.iban ?? "N/A"}</p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {acc.currentBalance} {acc.currency}
                      </div>
                    </div>
                  ))}
                  {(clientDetails[profileClientId].accounts ?? []).length === 0 && (
                    <p className="text-sm text-gray-600">Aucun compte trouvé.</p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                <p className="text-xs uppercase text-gray-500 mb-2">Historique crédits</p>
                <div className="space-y-2">
                  {(clientHistories[profileClientId] ?? []).map((loan: any) => {
                    const repayment = (clientRepayments[profileClientId] ?? []).find(
                      (r) => r.loanRequestId === loan.id,
                    );
                    const remainingTerms = repayment
                      ? Math.max((repayment.durationMonths ?? 0) - (repayment.paymentsMade ?? 0), 0)
                      : null;
                    return (
                      <div key={loan.id} className="rounded-lg border border-gray-200 px-3 py-2 bg-white">
                        <div className="flex justify-between text-sm text-gray-900">
                          <span>{loan.amount?.toLocaleString("fr-FR")} €</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {loan.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">{loan.purpose}</div>
                        <div className="text-[11px] text-gray-500">
                          Créée le {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString("fr-FR") : "—"}
                        </div>
                        {repayment && (
                          <div className="mt-2 text-[11px] text-gray-700 space-y-1">
                            <div>Mensualité : {repayment.monthlyAmount?.toFixed(2)} €</div>
                            <div>
                              Reste à rembourser : {repayment.remainingPrincipal?.toFixed(2)} €
                              {remainingTerms !== null
                                ? ` (${remainingTerms} échéance${remainingTerms > 1 ? "s" : ""} restantes)`
                                : ""}
                            </div>
                            <div>
                              Prochaine échéance :{" "}
                              {repayment.nextDueDate
                                ? new Date(repayment.nextDueDate).toLocaleDateString("fr-FR")
                                : "—"}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(clientHistories[profileClientId] ?? []).length === 0 && (
                    <p className="text-sm text-gray-600">Aucune demande de crédit pour ce client.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setProfileClientId(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withBankManagerProtection("/login")(DirectorLoanRequestsPage);

