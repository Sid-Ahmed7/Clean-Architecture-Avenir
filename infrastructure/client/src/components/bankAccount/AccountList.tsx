"use client";

import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { AccountCard } from "../ui/AccountCard";

interface AccountProps {
    accounts: AccountModel[];
    mainAccountId?: number;
}

export function AccountList(props: AccountProps) {
    const { accounts, mainAccountId } = props;
    
    const filteredAccounts = mainAccountId 
        ? accounts.filter(acc => acc.accountNumber !== mainAccountId)
        : accounts;

    if (filteredAccounts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Aucun autre compte disponible</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {filteredAccounts.map((account) => (
                <AccountCard key={account.accountNumber} account={account} />
            ))}
        </div>
    );
}