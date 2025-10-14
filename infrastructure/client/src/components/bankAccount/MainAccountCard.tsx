"use client";

import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";
import { useTranslations } from "next-intl";
import { LimitProgressBar } from "../ui/LimitProgressBar";

interface  MainAccountCardProps {
    account : AccountModel;
}

export function MainAccountCard(props : MainAccountCardProps) {

    const {account} = props;
    const t = useTranslations();

   return (
        <div className="bg-white rounded-lg border border-blue-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                            {account.customAccountName || `Compte ${account.accountNumber}`}
                        </h3>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            Principal
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">
                        {account.accountNumber.toString().padStart(11, '0')}
                    </p>
                    <span className="text-gray-500">IBAN : {account.iban}</span>

                </div>
            </div>

            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Solde disponible</p>
                <p className="text-3xl font-bold text-gray-900"> 
                  {account.currentBalance.toLocaleString()} {account.currency} 
                </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
                <LimitProgressBar
                    label="withdrawalLimit"
                    value={0} 
                    max={account.withdrawalLimit}
                    currency={account.currency}
                />
                <LimitProgressBar
                    label="transferLimit"
                    value={0}
                    max={account.transferLimit}
                    currency={account.currency}
                />
                <LimitProgressBar
                    label="overdraftLimit"
                    value={0}
                    max={account.overdraftLimit}
                    currency={account.currency}
                />
            </div>

            <div className="mt-4 flex justify-between items-center">
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
};