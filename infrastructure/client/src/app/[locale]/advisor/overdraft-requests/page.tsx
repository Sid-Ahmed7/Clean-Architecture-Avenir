"use client";

import { withBankAdvisorProtection } from "@/components/auth/withRoleProtection";
import { OverdraftRequestsPanel } from "@/components/bankAccount/OverdraftRequestsPanel";

function AdvisorOverdraftRequestsPage() {
    return (
        <div className="min-h-screen bg-white p-6">
            <OverdraftRequestsPanel />
        </div>
    );
}

export default withBankAdvisorProtection("/login")(AdvisorOverdraftRequestsPage);

