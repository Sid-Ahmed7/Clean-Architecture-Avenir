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
  clientName?: string;
}

export type LoanDecision = "approve" | "reject";

export interface LoanRepaymentSchedule {
  id: string;
  loanRequestId: string;
  clientId: string;
  monthlyAmount: number;
  remainingPrincipal: number;
  nextDueDate: string;
  durationMonths: number;
  paymentsMade: number;
  status: string;
  lastFailureReason?: string;
}

