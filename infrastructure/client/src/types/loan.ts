export interface LoanRequest {
  id: string;
  clientId: string;
  advisorId: string;
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
  proposedRate?: number;
}

export type LoanDecision = "approve" | "reject";

