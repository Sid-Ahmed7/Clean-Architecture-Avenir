import { apiClient } from "./apiClient";
import { LoanDecision, LoanRequest } from "@/types/loan";

export interface CreateLoanRequestInput {
  advisorId: string;
  amount: number;
  purpose: string;
}

export const createLoanRequest = async (data: CreateLoanRequestInput) => {
  return apiClient.post("/loan/request", data);
};

export const getAdvisorLoanRequests = async () => {
  const { data } = await apiClient.get<LoanRequest[]>("/loan/advisor/requests");
  return data ?? [];
};

export const getClientLoanRequests = async () => {
  const { data } = await apiClient.get<LoanRequest[]>("/loan/client/requests");
  return data ?? [];
};

export const advisorDecideLoanRequest = async (id: string, decision: LoanDecision) => {
  return apiClient.post(`/loan/advisor/requests/${id}/decision`, { decision });
};

export const directorDecideLoanRequest = async (id: string, decision: LoanDecision) => {
  return apiClient.post(`/loan/director/requests/${id}/decision`, { decision });
};

export const getDirectorLoanRequests = async () => {
  const { data } = await apiClient.get<LoanRequest[]>("/loan/director/requests");
  return data ?? [];
};

export const directorProposeRate = async (id: string, rate: number) => {
  return apiClient.post(`/loan/director/requests/${id}/propose-rate`, { rate });
};

export const clientRespondProposal = async (id: string, decision: LoanDecision) => {
  return apiClient.post(`/loan/client/requests/${id}/respond`, { decision });
};

export const setIndicativeRate = async (rate: number) => {
  return apiClient.post(`/loan/director/rate`, { rate });
};

export const getIndicativeRate = async () => {
  const { data } = await apiClient.get<{ rate: number | null }>("/loan/rate");
  return data.rate ?? null;
};

export const getClientRepayments = async () => {
  const { data } = await apiClient.get("/loan/client/repayments");
  return data ?? [];
};

