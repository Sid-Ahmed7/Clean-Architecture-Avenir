"use client";

import { withBankAdvisorProtection } from "@/components/auth/withRoleProtection";
import AdvisorLoanRequestsPageContent from "@/components/loan/AdvisorLoanRequestsPageContent";

function AdvisorLoanRequestsPage() {
  return <AdvisorLoanRequestsPageContent />;
}

export default withBankAdvisorProtection("/login")(AdvisorLoanRequestsPage);

