"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "ADVISOR_APPROVED").length;
    const needsRate = requests.filter((r) => r.amount > 5000 && r.status === "ADVISOR_APPROVED").length;
    const approved = requests.filter((r) => r.status === "DIRECTOR_APPROVED").length;
    return { total, pending, needsRate, approved };
  }, [requests]);

  useEffect(() => {
    Promise.all([getDirectorLoanRequests(), getIndicativeRate()])
      .then(([data, rate]) => {
        setRequests(data);
        setIndicativeRateState(rate);
      })
      .catch((err) => {
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
        setError(err.response?.data?.error || "Impossible d'enregistrer le taux indicatif");
      })
      .finally(() => setSavingRate(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Directeur</p>
            <h1 className="text-3xl font-bold text-slate-900">Validation des crédits</h1>
          </div>
          <p className="text-sm text-slate-600">
            Décidez des dossiers approuvés par les conseillers et proposez des taux pour les montants supérieurs à 5000€.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border bg-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-slate-500">Total</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl border bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-white/80">En attente</p>
            <p className="text-2xl font-semibold">{stats.pending}</p>
          </div>
          <div className="rounded-2xl border bg-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-slate-500">&gt; 5000€ à taux</p>
            <p className="text-2xl font-semibold text-amber-700">{stats.needsRate}</p>
          </div>
          <div className="rounded-2xl border bg-white shadow-sm px-4 py-3">
            <p className="text-xs uppercase text-slate-500">Validées</p>
            <p className="text-2xl font-semibold text-emerald-700">{stats.approved}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-xs uppercase text-slate-500">Taux indicatif</p>
              <p className="text-sm text-slate-700">Appliqué automatiquement pour les demandes ≤ 5000€</p>
            </div>
            {indicativeRate !== null && (
              <span className="text-sm font-semibold text-slate-900">Actuel : {indicativeRate}%</span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="number"
              step="0.01"
              className="w-full sm:w-32 px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={indicativeRate ?? ""}
              onChange={(e) => setIndicativeRateState(Number(e.target.value))}
            />
            <button
              disabled={savingRate}
              onClick={handleSaveIndicativeRate}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sauvegarder
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-700">Filtrer :</span>
          {[
            { key: "all", label: "Toutes" },
            { key: "pending", label: "En attente" },
            { key: "needsRate", label: "> 5000€ (taux)" },
            { key: "ready", label: "≤ 5000€ (valider)" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-3 py-1.5 rounded-full border text-sm transition ${
                filter === f.key
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 text-rose-700 px-4 py-3">{error}</div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border bg-white shadow-sm px-6 py-10 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucune demande à valider</p>
            <p className="text-sm text-slate-600 mt-1">
              Les dossiers validés par les conseillers apparaîtront ici.
            </p>
          </div>
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
                const needsRate = req.amount > 5000 && pendingDirector;
                const statusStyle =
                  {
                    ADVISOR_APPROVED: "bg-amber-50 text-amber-800 border border-amber-200",
                    RATE_PROPOSED: "bg-blue-50 text-blue-700 border border-blue-200",
                    DIRECTOR_APPROVED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                    REJECTED: "bg-rose-50 text-rose-700 border border-rose-200",
                  }[req.status] || "bg-slate-50 text-slate-700 border border-slate-200";
                const duration = req.durationMonths ? `${req.durationMonths} mois` : "—";
                const rateValue =
                  req.proposedRate !== undefined
                    ? `${req.proposedRate}%`
                    : needsRate
                      ? "À proposer"
                      : "—";
                return (
                  <div key={req.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Client</p>
                        <p className="text-lg font-semibold text-slate-900">{req.clientName ?? req.clientId}</p>
                        <p className="text-xs text-slate-500">Conseiller : {req.advisorName ?? req.advisorId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
                        {req.status}
                      </span>
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
                        <p className="font-semibold text-slate-900">{rateValue}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <p className="text-xs uppercase text-slate-500">Créée le</p>
                        <p className="font-semibold text-slate-900">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString("fr-FR") : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100">
                      <p className="text-xs uppercase text-slate-500 mb-1">Motif</p>
                      <p className="font-medium text-slate-900 leading-relaxed">{req.purpose}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {needsRate ? (
                        <>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Taux %"
                            className="w-full sm:w-28 px-3 py-2 border rounded-lg text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            value={rates[req.id] ?? ""}
                            onChange={(e) => setRates((prev) => ({ ...prev, [req.id]: Number(e.target.value) }))}
                            disabled={!pendingDirector || submitting === req.id}
                          />
                          <button
                            disabled={!pendingDirector || submitting === req.id}
                            onClick={() => handlePropose(req.id)}
                            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                          >
                            Proposer
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            disabled={!pendingDirector || submitting === req.id}
                            onClick={() => handleDecision(req.id, "APPROVE")}
                            className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
                          >
                            Valider
                          </button>
                          <button
                            disabled={!pendingDirector || submitting === req.id}
                            onClick={() => handleDecision(req.id, "REJECT")}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-800 text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                          >
                            Refuser
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => loadClientInfo(req.clientId)}
                        className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm w-full sm:w-auto hover:bg-slate-800 transition"
                      >
                        Voir profil
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

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

