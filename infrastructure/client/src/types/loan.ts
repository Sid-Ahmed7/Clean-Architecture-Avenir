export interface LoanRequest {
  id: string;
  clientId: string;
  advisorId: string;
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
  proposedRate?: number;
  durationMonths?: number;
  appliedRate?: number;
  monthlyPayment?: number;
  advisorName?: string;
  directorName?: string;
}

export type LoanDecision = "approve" | "reject";

