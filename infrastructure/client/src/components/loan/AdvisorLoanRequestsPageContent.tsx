"use client";

import { useEffect, useState } from "react";
import {
  advisorDecideLoanRequest,
  getAdvisorLoanRequests,
  getClientInfo,
  getClientLoanHistory,
  getClientRepaymentsFor,
} from "@/lib/api/loan";
import { LoanDecision, LoanRepaymentSchedule, LoanRequest } from "@/types/loan";
import AdvisorLoanRequestCard from "@/components/loan/AdvisorLoanRequestCard";
import ClientProfileModal from "@/components/loan/ClientProfileModal";

export function AdvisorLoanRequestsPageContent() {
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [clientDetails, setClientDetails] = useState<Record<string, any>>({});
  const [clientHistories, setClientHistories] = useState<Record<string, any[]>>({});
  const [clientRepayments, setClientRepayments] = useState<Record<string, any[]>>({});
  const [profileClientId, setProfileClientId] = useState<string | null>(null);

  useEffect(() => {
    getAdvisorLoanRequests()
      .then((data) => setRequests(data))
      .catch((err) => {
        console.error("Failed to load loan requests:", err);
        setError(err.response?.data?.error || "Impossible de charger les demandes");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDecision = (id: string, decision: LoanDecision) => {
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

  if (loading) {
    return <div className="p-6">Chargement des demandes...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Demandes de crédit</h1>
      <p className="text-sm text-gray-600 mb-6">Voici les demandes créées par les clients et assignées à vous.</p>

      {requests.length === 0 ? (
        <div className="bg-white border rounded-lg p-4 shadow-sm">Aucune demande pour le moment.</div>
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

