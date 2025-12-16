"use client";

import { withClientProtection } from "@/components/auth/withRoleProtection";
import LoanRequestForm from "@/components/loan/LoanRequestForm";

function LoanRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <LoanRequestForm />
    </div>
  );
}

export default withClientProtection("/login")(LoanRequestPage);

