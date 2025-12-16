"use client";

import { Info } from "lucide-react";

interface BlockedBalanceTooltipProps {
    blockedAmount: number;
    currency?: string;
}

export function BlockedBalanceTooltip({ blockedAmount, currency = "EUR" }: BlockedBalanceTooltipProps) {
    if (blockedAmount === 0) return null;

    return (
        <div className="inline-flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
            <Info size={16} />
            <div>
                <span className="font-semibold">{blockedAmount.toLocaleString()} {currency}</span>
                <span className="ml-1">bloqués dans vos ordres en attente</span>
            </div>
        </div>
    );
}
