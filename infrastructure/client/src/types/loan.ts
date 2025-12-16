import { FieldErrors, UseFormRegister } from "react-hook-form";

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

export type LoanRequestFieldsProps = {
  advisors: AdvisorOption[];
  loadingAdvisors: boolean;
  advisorError: string;
  register: UseFormRegister<CreateLoanRequestInput>;
  errors: FieldErrors<CreateLoanRequestInput>;
  duration?: number;
  onSelectDuration: (duration: number) => void;
  amount: number;
  indicativeRate: number | null;
  monthlyPayment: number;
  submitting: boolean;
  durations: number[];
  rateThreshold: number;
};

export type AdvisorLoanRequestCardProps = {
  request: LoanRequest;
  submittingId: string | null;
  onDecision: (id: string, decision: LoanDecision) => void;
  onViewProfile: (clientId: string) => void;
};

export type ClientProfileModalProps = {
  clientId: string;
  details: {
    user?: any;
    accounts?: any[];
  };
  history: LoanRequest[];
  repayments: LoanRepaymentSchedule[];
  onClose: () => void;
};

