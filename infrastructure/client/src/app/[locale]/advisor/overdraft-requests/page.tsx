"use client";

import { withBankAdvisorProtection } from "@/components/auth/withRoleProtection";
import { OverdraftRequestsPanel } from "@/components/bankAccount/OverdraftRequestsPanel";

function AdvisorOverdraftRequestsPage() {
    return (
        <div className="p-4">
            <OverdraftRequestsPanel />
        </div>
    );
}

export default withBankAdvisorProtection("/login")(AdvisorOverdraftRequestsPage);

