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

export type LoanDecision = "APPROVE" | "REJECT";

export interface CreateLoanRequestInput {
  advisorId: string;
  amount: number;
  purpose: string;
  durationMonths: number;
}

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

export type AdvisorOption = { id: string; fullName: string };

export interface ClientUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ClientAccount {
  accountNumber: string;
  accountType: string;
  iban?: string;
  currentBalance: number;
  currency: string;
}

export interface ClientDetails {
  user?: ClientUser;
  accounts?: ClientAccount[];
}





