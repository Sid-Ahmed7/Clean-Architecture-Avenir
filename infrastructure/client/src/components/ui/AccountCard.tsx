"use client";

import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";

interface AccountProps {
    accounts: AccountModel[];
    mainAccountId?: number;
}

export function AccountCard({ account }: { account: AccountModel }) {

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                            {account.customAccountName || `Compte ${account.accountNumber}`}
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500">
                        {account.accountNumber.toString().padStart(11, '0')}
                    </p>
                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Solde disponible</p>
                <p className="text-3xl font-bold text-gray-900">
                  {account.currentBalance.toLocaleString()} {account.currency}
                </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">IBAN</span>
                <span className="text-gray-900 font-medium">{account.iban}</span>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Type: {account.accountType}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    account.isActive && account.accountStatus === 'ACTIVE'
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                }`}>
                    {account.accountStatus}
                </span>
            </div>
        </div>
    );
}