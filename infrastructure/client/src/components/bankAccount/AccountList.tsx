"use client";

import { AccountModel } from "@/lib/validation/bankAccount/accountSchema";


interface AccountProps {
    accounts: AccountModel[];
    mainAccountId?: number;
}

export function AccountList(props: AccountProps) {
    const {accounts } = props;
      return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((acc) => (
        <div key={acc.accountNumber} className="bg-white p-4 rounded-xl shadow border border-gray-200">
          <h3 className="font-medium mb-2">{acc.customAccountName}</h3>
          <p className="text-gray-600 mb-1">Solde : {acc.currentBalance.toLocaleString()} {acc.currency}</p>
          <p className="text-gray-600 mb-1">Numéro : {acc.accountNumber}</p>
          <p className="text-gray-600 mb-1">IBAN : {acc.iban}</p>
          <p className="text-gray-600 mb-1">Statut : {acc.accountStatus}</p>
        </div>
      ))}
    </div>
  );
}