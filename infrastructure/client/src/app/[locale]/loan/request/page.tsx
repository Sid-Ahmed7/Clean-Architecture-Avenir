"use client";

import { withClientProtection } from "@/components/auth/withRoleProtection";
import LoanRequestForm from "@/components/loan/LoanRequestForm";

function LoanRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10">
      <LoanRequestForm />
    </div>
  );
}

export default withClientProtection("/login")(LoanRequestPage);

