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
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-2">{account.customAccountName}</h2>
      <p className="text-gray-600 mb-1">
        Solde : {account.currentBalance.toLocaleString()} {account.currency}
      </p>
      <p className="text-gray-600 mb-1">Numéro de compte : {account.accountNumber}</p>
      <p className="text-gray-600 mb-1">IBAN : {account.iban}</p>
      <p className="text-gray-600 mb-1">Statut : {account.accountStatus}</p>

     <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <LimitProgressBar
          label={t("withdrawalLimit")}
          value={0} 
          max={account.withdrawaLimit}
          currency={account.currency}
        />
        <LimitProgressBar
          label={t("transferLimit")}
          value={0}
          max={account.transferLimit}
          currency={account.currency}
        />
        <LimitProgressBar
          label={t("overdraftLimit")}
          value={0}
          max={account.overdraftLimit}
          currency={account.currency}
        />
      </div>
    </div>
    )
};